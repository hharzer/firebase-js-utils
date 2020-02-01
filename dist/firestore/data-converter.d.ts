import { Type } from "@co.mmons/js-utils/core";
import { DocumentData, FirestoreDataConverter } from "./shared-types";
export declare class DataConverter<T> implements FirestoreDataConverter<T> {
    private readonly type;
    constructor(type: Type<T>);
    fromFirestore(data: DocumentData): T;
    toFirestore(modelObject: T): DocumentData;
}
