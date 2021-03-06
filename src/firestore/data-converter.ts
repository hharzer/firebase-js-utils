import {DocumentData} from "./shared-types";
import {firestoreAdminModuleTypes, firestoreClientModuleTypes} from "./types";
import {QueryDocumentSnapshot} from "./union-types";

export abstract class DataConverter<T> implements firestoreClientModuleTypes.FirestoreDataConverter<T>, firestoreAdminModuleTypes.FirestoreDataConverter<T> {

    /**
     * Called by the Firestore SDK to convert a custom model object of type T
     * into a plain Javascript object (suitable for writing directly to the
     * Firestore database).
     *
     * @final
     */
    toFirestore(modelObject: T): DocumentData {
        return this.to(modelObject);
    }

    abstract to(modelObject: T): DocumentData;

    /**
     * @final
     */
    fromFirestore(data: DocumentData): T;

    /**
     * Called by the Firestore SDK to convert Firestore data into an object of
     * type T. You can access your data by calling: `snapshot.data(options)`.
     *
     * @param snapshot A QueryDocumentSnapshot containing your data and metadata.
     * @param options The SnapshotOptions from the initial call to `data()`.
     * @final
     */
    fromFirestore(snapshot: firestoreClientModuleTypes.QueryDocumentSnapshot, options: firestoreClientModuleTypes.SnapshotOptions): T;

    /**
     * @final
     */
    fromFirestore(dataOrSnapshot: DocumentData | firestoreClientModuleTypes.QueryDocumentSnapshot, options?: firestoreClientModuleTypes.SnapshotOptions): T {

        if (QueryDocumentSnapshot.is(dataOrSnapshot)) {
            return this.from(dataOrSnapshot.data(options));
        } else {
            return this.from(dataOrSnapshot);
        }
    }

    abstract from(data: DocumentData): T;

}
