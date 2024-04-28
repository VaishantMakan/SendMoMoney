/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export function BottomWarning({label, bottomText, to}) {
    return <div className="py-2 text-sm flex justify-center">
        <div>
            {label}
        </div>
        <Link className="pl-2 pointer underline cursor-pointer" to={to}>
            {bottomText}
        </Link>
    </div>
}