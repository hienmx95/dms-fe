import { Card, Spin } from 'antd';
import { Notification } from 'models/Notification';
import React from 'react';
import { notificationMobileRepository } from './NotificationMobileRepository';
import './NotificationMobile.scss';

export default function NotificationMobileView() {
    const [notification, setNotification] = React.useState<Notification>(new Notification());
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        setLoading(true);
        const url = document.URL;
        if (url.includes('get-notification/')) {
            const temp = url.split('get-notification/');
            const id = Number(temp[1]);
            notificationMobileRepository.getNotification(id)
                .then((noti: Notification) => {
                    setNotification(noti);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

    }, [setNotification]);

    return (
        <div className="page master-page banner-mobile survey">
            <Spin spinning={loading}>
                <Card >
                    <div className="container">
                        <div className="description">
                            <div contentEditable="false" dangerouslySetInnerHTML={{ __html: notification?.content }}></div>
                        </div>
                    </div>
                </Card>
            </Spin>
        </div>
    );
}
