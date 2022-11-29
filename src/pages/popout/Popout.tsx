import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import './Popout.css';

function Popout({ className, children, maxWidth, fallback, onClickOut } : {className?: string, children: any, maxWidth?: number, fallback?: any, onClickOut?: any}) {
    const navigate = useNavigate();

    const clickOut = (e:any) => {
        navigate(-1);
    }
    return <>
        {(maxWidth && window.innerWidth < maxWidth) ? fallback : (
        <div className={"popout " + className} onClick={onClickOut || clickOut}>
            <div className="closePopout"><Close /></div>
            {children}
        </div>)}
    </>
}

export default Popout;