/// <reference path="./types/DW_Rest.d.ts" />


/**
 *
 *
 * @export
 * @class DialogExpression
 * @implements {DWRest.IDialogExpression}
 */
export class DialogExpression implements DWRest.IDialogExpression {
    constructor(public Operation: DWRest.Operation, public Condition: DWRest.ICondition[]) {
    }
}


/**
 *
 *
 * @export
 * @class DialogExpressionCondition
 * @implements {DWRest.Condition}
 */
export class DialogExpressionCondition implements DWRest.ICondition {
    constructor(public DBName: string, public Value: string[] | null) {
    }
}
