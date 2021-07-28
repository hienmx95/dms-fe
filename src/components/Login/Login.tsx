import React from 'react';
import './Login.scss';
import { AppUser } from 'models/AppUser';
import { crudService } from 'core/services';
import { GlobalState } from 'core/config';
import { setGlobal, useGlobal } from 'reactn';
import nameof from 'ts-nameof.macro';
import authenticationService from 'services/AuthenticationService';
import { useHistory } from 'react-router';
import { ROOT_ROUTE } from 'config/route-consts';
import { join } from 'path';
import Spin from 'antd/lib/spin';
import { useTranslation } from 'react-i18next';
import { RouteConfigComponentProps } from 'react-router-config';
import { Checkbox } from 'antd';

function Login(props: RouteConfigComponentProps) {
  const [translate] = useTranslation();
  const history = useHistory();
  const [appUser, setAppUser] = React.useState<AppUser>();
  const [handleChangeSimpleField] = crudService.useChangeHandlers(
    appUser,
    setAppUser,
  );
  const [user] = useGlobal<AppUser>('user');

  const handleLogin = React.useCallback(() => {
    authenticationService.login(appUser).then((user: AppUser) => {
      setGlobal<GlobalState>({
        user,
      }).then(() => {
        const redirectPath = props.location.state || join(ROOT_ROUTE);
        history.push(redirectPath);
      });
    });
  }, [appUser, history, props.location.state]);

  React.useEffect(() => {
    if (user) {
      history.push(join(ROOT_ROUTE));
    }
  }, [user, history]);

  if (user) {
    return <Spin tip={translate('pages.login.loggingIn')} />;
  }

  return (
    <>
      <div className="login-page">
        <img
          className="background-img"
          src="/dms/assets/img/brand/background.png"
          id="bg"
          alt=""
        />
        <div className="login-content">
          <div className="logo">
            <img src="assets/img/brand/logo.png" alt={'noImage'} />
          </div>
          <div className="user-name">
            <input
              type="text"
              className="ant-input ant-input-sm mt-5 mb-3 input-login"
              placeholder="Tên đăng nhập"
              onChange={handleChangeSimpleField(nameof(appUser.username))}
            />
          </div>
          <div className="password">
            <input
              type="password"
              className="ant-input ant-input-sm mt-3 mb-3 input-login"
              placeholder="Mật khẩu"
              onChange={handleChangeSimpleField(nameof(appUser.password))}
            />
          </div>
          <div className="password mt-3 mb-3">
            <div className="row">
              <div className="col">
                <div className="checkbox">
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                </div>
              </div>
              <div className="col justify-content-end">
                <div className="forgot-password justify-content-end float-right">
                  <i className="fa fa-unlock-alt" aria-hidden="true"></i>
                  <span className="ml-2">Quên mật khẩu</span>
                </div>
              </div>
            </div>
            <div className="login">
              <button
                className="btn btn-primary btn-sm btn-login"
                onClick={handleLogin}
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
