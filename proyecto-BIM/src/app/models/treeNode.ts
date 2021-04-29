export class TreeNode<T = any>{
    parent?: string | null
    data?: T
    children?: TreeNode<T>[]
    expanded?: boolean
    expandable?: boolean
    visible?: boolean
    selectable?: boolean
    expandedIcon?: any
    collapsedIcon?: any
}