import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'
import nix from './../assets/brand/nix.png'
import deep from './../assets/brand/deep.png'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <img src={nix} style={{ width: 210, height: 90 }} />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/elect" component={NavLink}>
              Mes anterior
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/months" component={NavLink}>
              Histórico
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/reports" component={NavLink}>
              Reportes
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/statis" component={NavLink}>
              Nosotros
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        {/*
        <CHeaderNav>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

      */}
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>

      {/*
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>*/}
    </CHeader>
  )
}

export default AppHeader
