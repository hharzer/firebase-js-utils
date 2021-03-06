import {DataConverter} from "./data-converter";
import {CollectionReference, DocumentReference, Query} from "./union-types";
import {firestoreClientModuleTypes, firestoreAdminModuleTypes} from "./types";

export function applyConverter<T>(documentRef: firestoreClientModuleTypes.DocumentReference<any>, converter: DataConverter<T>): firestoreClientModuleTypes.DocumentReference<T>;

export function applyConverter<T>(documentRef: firestoreAdminModuleTypes.DocumentReference<any>, converter: DataConverter<T>): firestoreAdminModuleTypes.DocumentReference<T>;

export function applyConverter<T>(documentRef: DocumentReference<any>, converter: DataConverter<T>): typeof documentRef extends firestoreClientModuleTypes.DocumentReference ? firestoreClientModuleTypes.DocumentReference : firestoreAdminModuleTypes.DocumentReference<T>;

export function applyConverter<T>(collectionRef: firestoreClientModuleTypes.CollectionReference<any>, converter: DataConverter<T>): firestoreClientModuleTypes.CollectionReference<T>;

export function applyConverter<T>(collectionRef: firestoreAdminModuleTypes.CollectionReference<any>, converter: DataConverter<T>): firestoreAdminModuleTypes.CollectionReference<T>;

export function applyConverter<T>(collectionRef: CollectionReference<any>, converter: DataConverter<T>): typeof collectionRef extends firestoreClientModuleTypes.CollectionReference ? firestoreClientModuleTypes.CollectionReference<T> : firestoreAdminModuleTypes.CollectionReference<T>;

export function applyConverter<T>(query: firestoreClientModuleTypes.Query<any>, converter: DataConverter<T>): firestoreClientModuleTypes.Query<T>;

export function applyConverter<T>(query: firestoreAdminModuleTypes.Query<any>, converter: DataConverter<T>): firestoreAdminModuleTypes.Query<T>;

export function applyConverter<T>(query: Query, converter: DataConverter<T>): typeof query extends firestoreClientModuleTypes.Query<T> ? firestoreClientModuleTypes.Query<T> : firestoreAdminModuleTypes.Query<T>;

export function applyConverter<T, A extends DocumentReference<any> | Query<any> | CollectionReference<any>>(applicable: A, converter: DataConverter<T>): DocumentReference<T> | Query<T> | CollectionReference<T> {

    if (DocumentReference.isClient(applicable as DocumentReference) || DocumentReference.isAdmin(applicable as DocumentReference)) {
        return applyDocumentReference(applicable as any, converter) as any;
    } else if (CollectionReference.isClient(applicable as CollectionReference) || CollectionReference.isAdmin(applicable as CollectionReference)) {
        return applyCollectionReference(applicable as any, converter) as any;
    } else if (Query.isClient(applicable as Query) || Query.isAdmin(applicable as Query)) {
        return applyQuery(applicable as any, converter) as any;
    } else {
        throw new Error("DocumentReference, CollectionReference or Query must be given");
    }
}

function applyDocumentReference<T>(ref: DocumentReference<any>, converter: DataConverter<T>) {
    if (DocumentReference.isClient(ref)) {
        return ref.withConverter(converter);
    } else if (DocumentReference.isAdmin(ref)) {
        return ref.withConverter(converter);
    }
}

function applyCollectionReference<T>(ref: CollectionReference<any>, converter: DataConverter<T>) {
    if (CollectionReference.isClient(ref)) {
        return ref.withConverter(converter);
    } else if (CollectionReference.isAdmin(ref)) {
        return ref.withConverter(converter);
    }
}

function applyQuery<T>(query: Query<any>, converter: DataConverter<T>) {
    if (Query.isClient(query)) {
        return query.withConverter(converter);
    } else if (Query.isAdmin(query)) {
        return query.withConverter(converter);
    }
}
