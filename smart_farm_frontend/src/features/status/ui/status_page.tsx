import {LogMessageModalButton} from "../../logMessages/ui/LogMessageModalButton";
import {ResourceType} from "../../logMessages/models/LogMessage";

export const StatusPage = () => {
    return (
      <>
        <LogMessageModalButton resourceType={ResourceType.ADMIN} />
      </>
    );
}