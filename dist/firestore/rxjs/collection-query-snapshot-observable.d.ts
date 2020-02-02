import { Observable } from "rxjs";
import { DocumentData } from "../shared-types";
import { firestoreAdminTypes, firestoreClientTypes } from "../types";
import { CollectionReference, Query } from "../union-types";
export declare function querySnapshotObservable<T = DocumentData>(query: firestoreClientTypes.Query<T>, options?: firestoreClientTypes.SnapshotListenOptions): Observable<firestoreClientTypes.QuerySnapshot<T>>;
export declare function querySnapshotObservable<T = DocumentData>(query: firestoreAdminTypes.Query<T>): Observable<firestoreAdminTypes.QuerySnapshot<T>>;
export declare function querySnapshotObservable<T = DocumentData>(query: Query<T>): Observable<firestoreClientTypes.QuerySnapshot<T> | firestoreAdminTypes.QuerySnapshot<T>>;
export declare function collectionSnapshotObservable<T = DocumentData>(collection: firestoreClientTypes.CollectionReference<T>, options?: firestoreClientTypes.SnapshotListenOptions): Observable<firestoreClientTypes.QuerySnapshot>;
export declare function collectionSnapshotObservable<T = DocumentData>(collection: firestoreAdminTypes.CollectionReference<T>): Observable<firestoreAdminTypes.QuerySnapshot>;
export declare function collectionSnapshotObservable<T = DocumentData>(collection: CollectionReference<T>): Observable<firestoreClientTypes.QuerySnapshot<T> | firestoreAdminTypes.QuerySnapshot<T>>;
