import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import './Popout.css';

function Popout({ className, children, maxWidth, fallback } : {className?: string, children: any, maxWidth?: number, fallback?: any}) {
    const navigate = useNavigate();

    const clickOut = (e:any) => {
        navigate(-1);
    }
    return <>
        {(maxWidth && window.innerWidth < maxWidth) ? fallback : (
        <div className={"popout " + className} onClick={clickOut}>
            <div className="closePopout"><Close /></div>
            {children}
        </div>)}
    </>
}

export default Popout;