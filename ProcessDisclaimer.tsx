import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

export default function ProcessDisclaimer({
    processName,
    feedbackMessage = true,
}: {
    processName: "injection" | "extraction";
    feedbackMessage?: boolean;
}) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <InfoIcon size={16} className="ml-4 h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-[12px]">
                        The {processName} may occasionally produce errors.{" "}
                    </p>

                    {feedbackMessage && (
                        <p className="text-[12px]">
                            Please report any! Your feedback is really valuable
                            to us.
                        </p>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
