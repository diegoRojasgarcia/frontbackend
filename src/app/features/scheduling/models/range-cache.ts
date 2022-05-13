import { Observable } from "rxjs";

export interface RangeCache {
    range: Interval;
    obs: Observable<any> | null
}