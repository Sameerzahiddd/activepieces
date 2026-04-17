import { ImageWithColorBackground } from '@/components/custom/image-with-color-background';
import { apHostedAssetUrl } from '@/lib/ap-hosted-asset-url';
import { cn } from '@/lib/utils';

const StepNodeLogo = ({
  isSkipped,
  logoUrl,
  displayName,
}: {
  isSkipped: boolean;
  logoUrl: string;
  displayName: string;
}) => {
  const src = apHostedAssetUrl(logoUrl) ?? logoUrl;
  return (
    <div
      className={cn('flex items-center justify-center rounded-sm shrink-0', {
        'opacity-80': isSkipped,
      })}
    >
      <ImageWithColorBackground
        src={src}
        alt={displayName}
        key={src + displayName}
        border={true}
        className="w-9 h-9 p-2"
        roundedCorner={true}
      />
    </div>
  );
};

export { StepNodeLogo };
