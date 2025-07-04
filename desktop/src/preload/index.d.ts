// import { electronAPI } from "@electron-toolkit/preload";
import { Input, Output } from "@shared/types";

export interface ApplicationInterface {
  // electron: typeof electronAPI;

  api: {
    getMonacoBasePath: () => string;
    executeCode: (payload: Input) => Promise<Output>;
  };
}

declare global {
  interface Window {
    applicationApi: ApplicationInterface;
  }
}
