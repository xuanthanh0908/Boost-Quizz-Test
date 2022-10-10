import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { allRoutes } from './allroutes'

const Router = () => {
  return (
    <Routes>
      {allRoutes.map((item) => {
        const Element = item.components
        return (
          <Route
            key={item.id.toString()}
            element={<Element />}
            path={item.path}
          />
        )
      })}
    </Routes>
  )
}

export default Router
