import { ReactNode } from "react"

export type ExtendableQueryTableProps = {
    children: ReactNode
}

const ExtendableQueryTable = ({ children }: ExtendableQueryTableProps) => {
    return (
        <table className="nx-simple-table">
            <thead>
                <tr>
                    <th>Fragment</th>
                    <th>Side</th>
                    <th>Query operation</th>
                    <th>Page</th>
                    <th>Where is used</th>
                    <th>Return</th>
                    <th>Parameters</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    {
                        children
                    }
                </tr>
            </tbody>
        </table>
    )
}

export default ExtendableQueryTable