import {ApplyRemoteChangesFunction, IPersistedContext} from "dexie-syncable/api";
import {IDatabaseChange} from "dexie-observable/api";

interface ISyncProtocol {
  /** Maximum number of changes per sync() call. Default Infinity. */
  partialsThreshold?: number;

  /** Called by the framework to send changes to server and
   * receive changes back from server. */
  sync (
    context: IPersistedContext,
    url: string,
    options: Object,
    baseRevision: any,
    syncedRevision: any,
    changes: IDatabaseChange[],
    partial: boolean,
    applyRemoteChanges: ApplyRemoteChangesFunction,
    onChangesAccepted: ()=>void,
    onError: (error: any, again?: number) => void)
    : void;
}
