import { EXTENSION_REGEX_KEY, EXTENSION_STATUS_KEY } from "./constants";

export interface ExtensionCache {
	[EXTENSION_REGEX_KEY]?: string;
	[EXTENSION_STATUS_KEY]?: boolean;
	GET?: boolean;
	POST?: boolean;
	PUT?: boolean;
	DELETE?: boolean;
	PATCH?: boolean;
}
