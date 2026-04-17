import {
  ApFlagId,
  FlowActionType,
  TelemetryEventName,
} from '@activepieces/shared';
import { t } from 'i18next';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useTelemetry } from '@/components/providers/telemetry-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  PieceSelectorOperation,
  StepMetadataWithSuggestions,
  usePieceSearchContext,
} from '@/features/pieces';
import { flagsHooks } from '@/hooks/flags-hooks';
import { apHostedAssetUrl } from '@/lib/ap-hosted-asset-url';

import { useBuilderStateContext } from '../../builder-hooks';
import { convertStepMetadataToPieceSelectorItems } from '../piece-actions-or-triggers-list';

import AIActionItem from './ai-action';

type AIPieceActionsListProps = {
  hidePieceIconAndDescription: boolean;
  stepMetadataWithSuggestions: StepMetadataWithSuggestions;
  operation: PieceSelectorOperation;
};

const apCdn = (path: string) =>
  apHostedAssetUrl(`https://cdn.activepieces.com${path}`) ??
  `https://cdn.activepieces.com${path}`;

const ACTION_ICON_MAP: Record<string, string> = {
  run_agent: apCdn('/pieces/new-core/agent.svg'),
  generateImage: apCdn('/pieces/new-core/image-ai.svg'),
  askAi: apCdn('/pieces/new-core/text-ai.svg'),
  summarizeText: apCdn('/pieces/new-core/text-ai.svg'),
  classifyText: apCdn('/pieces/new-core/text-ai.svg'),
  extractStructuredData: apCdn('/pieces/new-core/utility-ai.svg'),
};

export const AIPieceActionsList: React.FC<AIPieceActionsListProps> = ({
  stepMetadataWithSuggestions,
  hidePieceIconAndDescription,
  operation,
}) => {
  const { capture } = useTelemetry();
  const { searchQuery } = usePieceSearchContext();
  const [handleAddingOrUpdatingStep] = useBuilderStateContext((state) => [
    state.handleAddingOrUpdatingStep,
  ]);
  const { data: isAgentsConfigured } = flagsHooks.useFlag<boolean>(
    ApFlagId.AGENTS_CONFIGURED,
  );
  const navigate = useNavigate();

  const aiActions = convertStepMetadataToPieceSelectorItems(
    stepMetadataWithSuggestions,
  );

  return (
    <ScrollArea className="h-full" viewPortClassName="h-full">
      <div className="grid grid-cols-3 p-2 gap-3 min-w-[350px]">
        {aiActions.map((item, index) => {
          const actionIcon =
            item.type === FlowActionType.PIECE
              ? ACTION_ICON_MAP[item.actionOrTrigger.name]
              : apCdn('/pieces/new-core/image-ai.svg');
          return (
            <AIActionItem
              key={index}
              item={item}
              hidePieceIconAndDescription={hidePieceIconAndDescription}
              stepMetadataWithSuggestions={{
                ...stepMetadataWithSuggestions,
                logoUrl: actionIcon,
              }}
              onClick={() => {
                if (!isAgentsConfigured) {
                  toast('Connect to OpenAI', {
                    description: t(
                      "To create an agent, you'll first need to connect to OpenAI in platform settings.",
                    ),
                    action: {
                      label: 'Set Up',
                      onClick: () => {
                        navigate('/platform/setup/ai');
                      },
                    },
                  });
                  return;
                }

                if (item.type === FlowActionType.PIECE) {
                  capture({
                    name: TelemetryEventName.PIECE_SELECTOR_SEARCH,
                    payload: {
                      search: searchQuery,
                      isTrigger: false,
                      selectedActionOrTriggerName: item.actionOrTrigger.name,
                    },
                  });
                }
                handleAddingOrUpdatingStep({
                  pieceSelectorItem: item,
                  operation,
                  selectStepAfter: true,
                });
              }}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
};
