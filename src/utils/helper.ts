import { parse } from "date-fns";

export const compareDateStrings = (firstDate: string, secondDate: string) => {
    const date1 = parse(firstDate, "MM-dd-yyyy", new Date());
    const date2 = parse(secondDate, "MM-dd-yyyy", new Date());
    return date1 > date2 ? 1 : (date1 < date2 ? -1 : 0);
}