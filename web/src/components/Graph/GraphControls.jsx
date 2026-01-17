import { Expand } from 'lucide-preact';
import { Button } from '..';

export function GraphControls({
    isLocked,
    isShowingLabels,
    onShowBridges,
    onToggleLayout,
    onResetZoom,
}) {
    return (
        <div class='fixed bottom-4 flex'>
            <div class='flex space-x-3'>
                <Button
                    variant={isShowingLabels.value ? 'primary' : 'secondary'}
                    onClick={() => {
                        isShowingLabels.value = !isShowingLabels.value;
                        onShowBridges(isShowingLabels.value);
                    }}
                >
                    {isShowingLabels.value ? 'Hide Labels' : 'Show Labels'}
                </Button>
                <Button
                    variant={isLocked.value ? 'primary' : 'secondary'}
                    onClick={() => {
                        isLocked.value = !isLocked.value;
                        onToggleLayout(isLocked.value);
                    }}
                >
                    {isLocked.value ? 'Unlock' : 'Lock'}
                </Button>
                <Button
                    variant='secondary'
                    size='icon'
                    onClick={() => onResetZoom()}
                >
                    <Expand />
                </Button>
            </div>
        </div>
    );
}
