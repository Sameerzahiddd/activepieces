import { t } from 'i18next';
import { CircleHelp, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

// Help menu points at otom8 support channels only. AP's docs/changelog/
// community links were removed as part of brand-5 so users never get bounced
// out of our product onto the upstream AP site.
export const HelpAndFeedback = () => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center w-full text-left px-2 py-1.5 text-sm rounded-sm cursor-pointer">
        <CircleHelp className="w-4 h-4 mr-2" />
        {t('Help & Feedback')}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-[220px]">
        <DropdownMenuItem asChild>
          <Link
            to="mailto:support@otom8.us"
            className="flex justify-between w-full"
          >
            <div className="flex items-center gap-2">
              <Mail className="size-4" />
              <span>{t('Email support')}</span>
            </div>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
