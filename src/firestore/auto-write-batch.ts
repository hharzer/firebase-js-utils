import {UpdateData} from "./shared-types";
import {firestoreAdminModuleTypes, firestoreClientModuleTypes} from "./types";
import {DocumentReference, FieldPath, Firestore, WriteBatch} from "./union-types";

export abstract class AutoWriteBatch {

    protected constructor(private readonly firestore: Firestore) {
    }

    onCommit: (count: number, results?: any) => void;

    protected batch$: WriteBatch;

    protected limit$: number = 249;

    protected count$: number = 0;

    protected get batch(): WriteBatch {
        if (!this.batch$) {
            this.batch$ = this.firestore.batch();
        }

        return this.batch$;
    }

    get count(): number {
        return this.count$;
    }

    get limit() {
        return this.limit$;
    }

    set limit(limit: number) {
        this.limit$ = limit > 0 && limit <= 249 ? limit : 249;
    }

    isFull() {
        return this.count$ >= this.limit$;
    }

    async autoCommit(): Promise<{count: number, results?: any}> {

        if (this.count$ > this.limit$) {
            const count = this.count$;
            const results = await this.batch.commit();
            this.batch$ = undefined;
            this.count$ = 0;

            if (this.onCommit) {
                try {
                    this.onCommit(count, results);
                } catch (e) {
                    console.error(e);
                }
            }

            return {count, results};
        }

        return {count: 0};
    }

    async commit(): Promise<{count: number, results?: any}> {

        if (this.count$ > 0) {
            const count = this.count$;
            const results = await this.batch.commit();
            this.batch$ = undefined;
            this.count$ = 0;

            if (this.onCommit) {
                try {
                    this.onCommit(count, results);
                } catch (e) {
                    console.error(e);
                }
            }

            return {count, results};
        }

        return {count: 0};
    }

    delete(documentRef: DocumentReference<any>): this {
        this.count$++;
        this.batch.delete(documentRef as any);
        return this;
    }

    set<T = any>(documentRef: DocumentReference<T>, data: T, options?: any): this {

        this.count$++;

        if (DocumentReference.isClient(documentRef) && WriteBatch.isClient(this.batch)) {
            this.batch.set(documentRef, data, options);
        } else if (DocumentReference.isAdmin(documentRef) && WriteBatch.isAdmin(this.batch)) {
            this.batch.set(documentRef, data, options);
        }

        return this;
    }

    update(documentRef: DocumentReference<any>, dataOrField: UpdateData | string | FieldPath, value?: any, ...moreFieldsAndValues: any[]): this {

        this.count$++;

        if (arguments.length === 2) {
            if (DocumentReference.isClient(documentRef) && WriteBatch.isClient(this.batch)) {
                this.batch.update(documentRef, dataOrField as UpdateData);
            } else if (DocumentReference.isAdmin(documentRef) && WriteBatch.isAdmin(this.batch)) {
                this.batch.update(documentRef, dataOrField as UpdateData);
            }
        } else {
            if (DocumentReference.isClient(documentRef) && WriteBatch.isClient(this.batch)) {
                this.batch.update(documentRef, dataOrField as (string | firestoreClientModuleTypes.FieldPath), value, ...moreFieldsAndValues);
            } else if (DocumentReference.isAdmin(documentRef) && WriteBatch.isAdmin(this.batch)) {
                this.batch.update(documentRef, dataOrField as (string | firestoreAdminModuleTypes.FieldPath), value, ...moreFieldsAndValues);
            }
        }

        return this;
    }

}

interface AutoWriteBatchClientMethods {
    commit(): Promise<{count: number}>;
    set<T = any>(documentRef: firestoreClientModuleTypes.DocumentReference<T>, data: T, options?: firestoreClientModuleTypes.SetOptions): this;
    update(documentRef: firestoreClientModuleTypes.DocumentReference<any>, dataOrField: UpdateData | string | firestoreClientModuleTypes.FieldPath, value?: any, ...moreFieldsAndValues: any[]): this;
}

export class AutoWriteBatchClient extends AutoWriteBatch implements AutoWriteBatchClientMethods {

    constructor(firestore: firestoreClientModuleTypes.Firestore) {
        super(firestore);
    }

}

interface AutoWriteBatchAdminMethods {

    create(documentRef: firestoreAdminModuleTypes.DocumentReference<any>, data: UpdateData): this;

    /**
     * Update fields of the document referred to by the provided
     * `DocumentReference`. If the document doesn't yet exist, the update fails
     * and the entire batch will be rejected.
     *
     * Nested fields can be updated by providing dot-separated field path
     * strings.
     *
     * @param documentRef A reference to the document to be updated.
     * @param data An object containing the fields and values with which to
     * update the document.
     * @param precondition A Precondition to enforce on this update.
     * @return This `WriteBatch` instance. Used for chaining method calls.
     */
    update(documentRef: firestoreAdminModuleTypes.DocumentReference<any>, data: UpdateData, precondition?: firestoreAdminModuleTypes.Precondition): this;

    /**
     * Deletes the document referred to by the provided `DocumentReference`.
     *
     * @param documentRef A reference to the document to be deleted.
     * @param precondition A Precondition to enforce for this delete.
     * @return This `WriteBatch` instance. Used for chaining method calls.
     */
    delete(documentRef: firestoreAdminModuleTypes.DocumentReference<any>, precondition?: firestoreAdminModuleTypes.Precondition): this;

    commit(): Promise<{count: number, results?: firestoreAdminModuleTypes.WriteResult[]}>;

}

export class AutoWriteBatchAdmin extends AutoWriteBatch implements AutoWriteBatchAdminMethods {

    constructor(firestore: firestoreAdminModuleTypes.Firestore) {
        super(firestore);
    }

    private get adminBatch() {
        return this.batch as firestoreAdminModuleTypes.WriteBatch;
    }

    create(documentRef: firestoreAdminModuleTypes.DocumentReference<any>, data: any) {
        this.count$++;
        this.adminBatch.create(documentRef, data);
        return this;
    }

}

export function autoWriteBatch(firestore: firestoreAdminModuleTypes.Firestore): AutoWriteBatchAdmin;

export function autoWriteBatch(firestore: firestoreClientModuleTypes.Firestore): AutoWriteBatchClient;

export function autoWriteBatch(firestore: Firestore): AutoWriteBatch {
    if (Firestore.isClient(firestore)) {
        return new AutoWriteBatchClient(firestore);
    } else if (Firestore.isAdmin(firestore)) {
        return new AutoWriteBatchAdmin(firestore);
    }
}
