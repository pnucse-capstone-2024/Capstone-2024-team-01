const Patient = ({num, onButtonClick}) => {


return(
    <div className="sb-sidenav-menu-heading" onClick={()=>{onButtonClick(num)}} style={{ cursor: 'pointer' }}>
        <div>patient {num} </div>
    </div>
)

}

export default Patient;