const Legend = () => {
    return (
        <div className="legend">
            <div style={{ "--color": '#FD2300' }}>60% - 99%</div>
            <div style={{ "--color": '#F6F915'}}>30% - 60%</div>
            <div style={{ "--color": '#44FB27' }}>0 - 30%</div>
        </div>
    );
}
export default Legend;