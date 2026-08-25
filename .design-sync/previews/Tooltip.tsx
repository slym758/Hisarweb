import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'hisar-ui';

export function IconTooltip() {
    return (
        <TooltipProvider>
            <Tooltip open>
                <TooltipTrigger asChild>
                    <Button variant="outline">Hastayı bilgilendir</Button>
                </TooltipTrigger>
                <TooltipContent>Hastaya randevu hatırlatma SMS'i gönderir</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
