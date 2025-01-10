import React, { useEffect } from "react";
import { Helmet } from 'react-helmet'

const Pagetitle = ({ title, children }) => {


    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            {children}</>
    )
}

export default Pagetitle