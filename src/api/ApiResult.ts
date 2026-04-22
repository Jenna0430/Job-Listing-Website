
export type ApiResult<T> = | 
{ success: true; data: T } |
{ success: false; error: string };

export const ok = <T>(data: T): ApiResult<T> => ({ success: true, data });
export const fail = <T>(error: string): ApiResult<T> => ({ success: false, error });

export const parseError = (error: unknown): string => {
    if(error && typeof error === "object" && "message" in error) {
        return (error as {message: string}).message;
    }
        if(error instanceof Error) return error.message;
        return "An unknown error occurred";
}

export const DB_ERROR_CODES = {
    UNIQUE_VIOLATION: "23505",
    FOREIGN_KEY_VIOLATION: "23503",
    NOT_NULL_VIOLATION: "23502",
} as const;

export const PGRST_NO_ROWS = "PGRST116";

