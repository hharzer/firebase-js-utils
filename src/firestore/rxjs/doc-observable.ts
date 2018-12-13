import {Observable} from "rxjs";
import {UniversalFirestore} from "../firestore";
import {DocumentReference, DocumentSnapshot, GetOptions, SnapshotOptions, SnapshotListenOptions} from "../types";

function docObservable(this: UniversalFirestore, doc: string | DocumentReference, options?: GetOptions & SnapshotOptions & SnapshotListenOptions): Observable<DocumentSnapshot> {

    if (typeof doc == "string") {
        return this.docObservable(this.doc(doc), options);
    }

    return new Observable(subscriber => {
        let unsubscribe = doc.onSnapshot(options || {}, subscriber);
        return () => unsubscribe();
    });
}

declare module "../firestore" {

    interface UniversalFirestore {
        docObservable(doc: string | DocumentReference, options?: GetOptions & SnapshotOptions & SnapshotListenOptions): Observable<DocumentSnapshot>;
    }

}

UniversalFirestore.prototype.docObservable = docObservable;
