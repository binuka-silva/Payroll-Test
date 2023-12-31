import React, {Fragment, useState} from "react";
import { NavLink } from "react-router-dom";
import history from "../../@history";

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
        {routeSegments ? (
          <Fragment>
            <h1>{routeSegments[routeSegments.length - 1]["name"]}</h1>
          </Fragment>
        ) : null}
        <ul>
          {routeSegments
            ? routeSegments.map((route, index) =>
                index !== routeSegments.length - 1 ? (
                  <li key={index}>
                    <NavLink to={route.path} onClick={navClicked}>
                      <span className="capitalize text-muted" id={route.path}>
                        {route.name}
                      </span>
                    </NavLink>
                  </li>
                ) : (
                  <li key={index}>
                    <span className="capitalize text-muted">{route.name}</span>
                  </li>
                )
              )
            : null}
        </ul>
      </div>
      <div className="separator-breadcrumb border-top" style={breadCrumbSeparatorStyles}></div>
    </Fragment>
  );
};

export default Breadcrumb;
