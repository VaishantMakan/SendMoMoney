/* eslint-disable react/prop-types */
export const Balance = ({value}) => {
    return <div className="flex">
        <div className="font-bold text-lg">
            Your Balance
        </div>
        <div className="text-lg font-semibold ml-4">
            ${value}
        </div>
    </div>
}