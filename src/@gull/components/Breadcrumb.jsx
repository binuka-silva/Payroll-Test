import React, {Fragment, useState} from "react";
import { NavLink } from "react-router-dom";
import history from "../../@history";
import "./breadcrumb.scss"

const Breadcrumb = ({ routeSegments, breadCrumbSeparatorStyles, isPreviousPagePersist }) => {
    const [x, setX] = useState(0);

    function navClicked(e) {
        if (e.target.id === routeSegments[routeSegments.length - 2]?.path && isPreviousPagePersist && x === 0){
            history.goBack();
            setX(1);
        }
    }

  return (
    <Fragment>
      <div className="breadcrumb">
        
        <ul>
          {routeSegments
            ? routeSegments.map((route, index) =>
                index !== routeSegments.length - 1 ? (
                  <li key={index}>
                    <NavLink to={route.path} onClick={navClicked}>
                      <span className="capitalize text-muted mainTopic" id={route.path}>
                        {route.name}
                      </span>
                    </NavLink>
                  </li>
                ) : (
                  <li key={index}>
                    <span className="capitalize text-muted mainTopic">{route.name}</span>
                    
                  </li>
                )
              )
            : null}
        </ul>
        
        
      </div>
      <div className="breadcrumb">
      {routeSegments ? (
          <Fragment>
            &nbsp;&nbsp;
            <h1 className="mainTopic">{routeSegments[routeSegments.length - 1]["name"]}</h1>
          </Fragment>
        ) : null}
      </div>
      <div className="separator-breadcrumb border-top" style={breadCrumbSeparatorStyles}></div>
    </Fragment>
  );
};

export default Breadcrumb;
