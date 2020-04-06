import React, {Component} from 'react';
import {connect} from 'react-redux';
import DLayouta  from '@/components/dLayout1'
import '@/assets/css/cbct.css'
import Kp from '../kelper/index'
@connect((store) => {
    return {};
})
class Index extends Component {
    static displayName='Dash';
    state={
        tabbar:[
            {title:"CURIE",url:""}
        ]
    }
    componentDidMount(){
        //this.props.dispatch({type:'user/alice'})
    }
    fnChange(){

    }
    render() {

        return (
            <DLayouta tabbar={this.state.tabbar}>
                {/*左侧开始*/}
                <div className="cl-sidebar" data-position="right" id="leftMenu" style={{"background":"#292929"}}>
                    <div className="patientlist cl-navblock" style={{"height":"100%"}}>
                        <ul className="yiji">
                            <li style={{paddingBottom: "3px"}}>
                                <input type="text" name="searchPatient" placeholder="Search Patient" className="search-input"/>
                            </li>
                            <li>
                            <a href="#" series="0" pantientid="1" className="inactive" id="PatientItem"  ><i className="fa fa-square-o" aria-hidden="true"></i> Cathy Kingslan</a>
                            <ul style={{display: "none"}}>
                                <li className="patientlast">
                                    <a href="#" series="1" className="inactive" id ="ImageSeries"  ><i className="fa fa-square-o" aria-hidden="true"></i> CT 2019/06/21</a>
                                    <ul>
                                        <li>
                                            <a series="2" href="#" ct_id="1" id ="ImageItem"  > <i className="fa fa-square-o" aria-hidden="true"></i> REG 2019/07/01</a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            </li>
                        </ul>
                        </div>
                </div>
                {/*左侧结束*/}
                 <div className="container-fluid" id="pcont" style={{"paddingBottom": "49px" , "height":"100%","width":"85" }}>
                    <div id="hidden-patient-info" style={{"paddingLeft":"1px","width":"36px","float":"left"}}>
                        <div className="box box-solid box-info box2" style={{"height":"106%","marginTop":"1px"}}>
                            <div className="box-body" style={{"textAlign":"center","marginTop":"1px"}}>
                                <i className="fa fa-search fa-inverse fa-2x" aria-hidden="true" id="input-icon" style={{paddingTop:"7px",display:"none",cursor:"pointer"}} title="show menu"></i>
                                <ul className="navbar-nav" style={{padding:"2px",marginTop:"8px"}} id="nav-menu">
                                    <li>
                                        <a href="#" data-toggle="offLeftMenu" role="button" title="hidden menu">
                                            <span className="sr-only">Toggle navigation</span>
                                            <span className="icon-bar"></span>
                                            <span className="icon-bar"></span>
                                            <span className="icon-bar"></span>
                                        </a>
                                    </li>
                                </ul>
                                <img src="/static/images/show-patient.png" style={{width:"20px",height:"30px",cursor:"pointer"}} id="show-patient" title="Show Patient Info"/>
                                <img src="/static/images/show-treatment.png" style={{width: "20px",height:"20px",cursor: "pointer",marginTop:"5px"}} id="show-treatment" title="Show Treatment Info"/>
                                <img src="/static/images/show-comment.png" style={{width: "20px",height:"20px",cursor: "pointer",marginTop:"5px"}} id="show-comment" title="Show Comment Info"/>
                            </div>
                        </div>
                    </div>

                     <div id="patient-info-div" className="col-sm-2 col-md-2 patient-info" style={{display:"none",width:"17%",paddingLeft:"1px"}}>
                         <div className="box box-solid box-info" style={{height: "38%",marginBottom:"1px"}}>
                             <div className="box-header">
                                 <h3 className="box-title">
                                     Patient Info
                                     <a href="#" id="show-list" style={{float: "right",color: "#FCFAF2"}}>
                                         <img src="" style={{width: "17px",height:"25px",marginTop: "-9px"}} id="show-patient2" title="Show Patient List"/>
                                     </a>
                                 </h3>
                             </div>
                             <div className="box-body box-body2" style={{marginTop:"0px"}}>
                                 <p>
                                     <span>Patient Name:</span>
                                     <span id="patientnm" ></span>
                                 </p>
                                 <p>
                                     <span>Patient ID:</span>
                                     <span id="patientid" ></span>
                                 </p>
                                 <p>
                                     <span>Gender:</span>
                                     <span>&nbsp;</span>
                                 </p>
                                 <p>
                                     <span>Age:</span>
                                     <span>&nbsp;</span>
                                 </p>
                                 <p>
                                     <span>Diagnosis:</span>
                                     <span>&nbsp;</span>
                                 </p>
                                 <p style={{marginTop:"-2px"}}>
                                     <span>Institution:</span>
                                     <span>&nbsp;</span>
                                 </p>
                             </div>
                         </div>
                         <div className="box box-solid box-info box-body2" style={{height: "40%"}}>
                             <div className="box-header">
                                 <h3 className="box-title">Treatment Infomation</h3>
                             </div>
                             <div className="box-body">
                                 <p style={{paddingTop: "23px",marginTop: "13px"}}>
                                     <span>Physician Name:</span>
                                     <span>&nbsp;</span>
                                 </p>
                                 <p>
                                     <span>physicist Name:</span>
                                     <span>&nbsp;</span>
                                 </p>
                                 <p>
                                     <span>Date & Time:</span>
                                     <span>&nbsp;</span>
                                 </p>
                                 <p>
                                     <span>Plan Name:</span>
                                     <span>&nbsp;</span>
                                 </p>
                                 <p>
                                     <span>Fraction:</span>
                                     <span>&nbsp;</span>
                                 </p>
                                 <p>
                                     <span>Treatment Unit:</span>
                                     <span>&nbsp;</span>
                                 </p>
                             </div>
                         </div>
                         <div className="box box-solid box-info box-body2" style={{height:"29%"}}>
                             <div className="box-header">
                                 <h3 className="box-title">Comments</h3>
                             </div>
                             <div className="box-body">
                                 &nbsp;
                             </div>
                         </div>
                     </div>
                     <div id="TSC3D" className="  flex">
                         <div style={{background:"#1c1c1c"}}>
                             <Kp></Kp>
                         </div>
                         <div id="tool-div"  style={{ width:"215px", height: "100%",paddingLeft: "1px",paddingRight: "1px",width: "19%"}}>
                             <div className="box box-solid box-info img-tool2" style={{height: "56%",marginTop: "0px",marginBottom: "3px"}}>
                                 <div className="box-body">
                                     <div className="img-tool-p" style={{ lineHeight: "2px"}}>
                                         <button type="button" className="tool-btn" style={{marginTop: "18px",height: "40px",width: "93%"}} id="acquireCBCTButton">Acquire CBCT</button>

                                     </div>
                                     <div className="img-tool-p" style={{ lineHeight: "2px"}}>
                                         <button type="button" className="tool-btn tool-btn1" style={{width: "44%",height: "40px",backgroundColor: "#ED784A",color: "#FCFAF2"}} title="P Images" id="Pri" >P Images</button>
                                         <button type="button" className="tool-btn tool-btn1" style={{width: "44%",height: "40px",marginLeft: "10px"}} title="S Images" id="Sec"  >S Images</button>
                                     </div>
                                     <div className="img-tool-p" style={{ lineHeight: "2px"}}>
                                         <button type="button" className="tool-btn tool-btn1" style={{width: "27%",height: "40px"}} id="ZoomIn"  >ZoomIn</button>
                                         <button type="button" className="tool-btn tool-btn1" style={{width: "27%",height: "40px",marginLeft: "10px"}} id="ZoomOut" title="ZoomOut"  >ZoomO.</button>
                                         <button type="button" className="tool-btn tool-btn1" style={{width: "27%",height: "40px",float: "right",marginRight:"15px"}} id="ZoomReset" title="ZoomReset"  >Reset</button>
                                     </div>
                                     <div className="img-tool-p" style={{ lineHeight: "2px"}}>
                                         <button type="button" className="tool-btn tool-btn1" style={{width: "27%",height: "40px"}} id="Adjust">W/L</button>
                                         <div className="wl-wigdet">
                                             <input type="number" className="tool-number" id="wwidth" title="Window Width" style={{width: "46%"}} name="window-width" value="1500" onChange={this.fnChange.bind(this)} />
                                             <input type="number" className="tool-number" id="wcenter"  title="Window Level" style={{width: "46%",float: "right"}} name="window-level" value="365" onChange={this.fnChange.bind(this)} />
                                             <div className="dropdown drop-select-parent" id="AdjustWL">
                                                 <a href="#" className="dropdown-toggle" data-toggle="dropdown"><img src="/static/images/off.png" style={{marginBottom: "-10px"}}/></a>
                                                 <ul className="dropdown-menu">
                                                     <li><a className="drop-wl drop-select-wl" sw="40" sl="40">STROKE</a></li>
                                                     <li><a className="drop-wl drop-select-wl" sw="80" sl="40">BRAIN</a></li>
                                                     <li><a className="drop-wl drop-select-wl" sw="100" sl="40">BRAIN_POSTERIOR_FOSSA</a></li>
                                                     <li><a className="drop-wl drop-select-wl" sw="150" sl="30">LIVER</a></li>
                                                     <li><a className="drop-wl drop-select-wl" sw="200" sl="80">SUBDURAL</a></li>
                                                     <li><a className="drop-wl drop-select-wl" sw="350" sl="50">MEDIASTINUM</a></li>
                                                     <li><a className="drop-wl drop-select-wl" sw="400" sl="40">CHEST_SOFT_TISSUE</a></li>
                                                     <li><a className="drop-wl drop-select-wl" sw="400" sl="420">ABDOMEN</a></li>
                                                     <li><a className="drop-wl drop-select-wl" sw="500" sl="50">SPINE_SOFT_TISSUE</a></li>
                                                     <li><a className="drop-wl drop-select-wl" sw="600" sl="300">ANGIO</a></li>
                                                     <li><a className="drop-wl drop-select-wl" sw="1000" sl="-700">LUNGS</a></li>
                                                     <li><a className="drop-wl drop-select-wl" sw="1500" sl="450">BONE</a></li>
                                                     <li><a className="drop-wl drop-select-wl" sw="1600" sl="300">BONE_SPINE</a></li>
                                                     <li><a className="drop-wl drop-select-wl" sw="3000" sl="500">BONE_TEMPORAL</a></li>
                                                 </ul>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                             <div className="box box-solid box-info img-tool2" style={{marginTop: "1px",height: "51%"}}>
                                 <div className="box-body">
                                     <div className="reg-tool-p" style={{paddingLeft: "1px",width: "93%"}}>
                                         <button type="button" className="tool-btn" id="manualReg" style={{width: "47%",backgroundColor: "#ED784A",color: "#FCFAF2"}}>Manual Reg</button>
                                         <button type="button" className="tool-btn" id="autoReg" style={{width: "47%",marginLeft:"10px"}}>Auto Reg</button>
                                     </div>
                                     <div className="reg-tool-p reg-tool-p2">
                                         <input type="checkbox" id="usePointRegistration"/>&nbspUse Point Registration
                                         <i className="fa fa-question-circle-o" aria-hidden="true" data-toggle="tooltip" title="Use Point Registration ..."></i>
                                     </div>
                                     <div className="reg-tool-p reg-tool-p3">
                                         <div className="inner-div" style={{borderTopLeftRadius: "10px",borderTopRightRadius: "10px",paddingTop: "5px"}}>
                                             Couch Shift Result:
                                         </div>
                                         <div className="inner-div">
                                             X: <input type="number" className="operator-input" step="0.01"/> cm &nbsp;<button id="xPlus" className="operator-btn">+</button>&nbsp;<button id="xMinus" className="operator-btn">-</button>
                                         </div>
                                         <div className="inner-div">
                                             Y: <input type="number" className="operator-input" step="0.01"/> cm &nbsp;<button id="yPlus" className="operator-btn">+</button>&nbsp;<button id="yMinus" className="operator-btn">-</button>
                                         </div>
                                         <div className="inner-div" style={{borderBottomLeftRadius: "10px",borderBottomRightRadius: "10px"}}>
                                             Z: <input type="number" className="operator-input" step="0.01"/> cm &nbsp;<button id="zPlus" className="operator-btn">+</button>&nbsp;<button id="zMinus" className="operator-btn">-</button>
                                         </div>
                                     </div>
                                     <div className="reg-tool-p" style={{paddingLeft: "1px",width: "93%"}}>
                                         <button type="button" className="tool-btn tool-btn2" style={{width: "47%"}} id="save">Save</button>
                                         <button type="button" className="tool-btn tool-btn2" style={{width: "47%",marginLeft:"10px"}} id="printCouchShift">Print</button>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>


                </div>
            </DLayouta>
        );
    }
}

function mapStateToProps(state) {
    console.log(state)
    return { };
}

/*export default connect(
    mapStateToProps,
)(dashLayout(Index));*/

export default  (Index)
