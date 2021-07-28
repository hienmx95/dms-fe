import { Col, Input, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Table, { ColumnProps } from 'antd/lib/table';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { generalLanguageKeys } from 'config/consts';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalProps } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import './SurveyMasterPreview.scss';
import { surveyPreiviewService } from './SurveyPreviewService';
import { v4 as uuidv4 } from 'uuid';

export interface SurveyOtherPreviewIPops extends ModalProps {
    title?: string;
    model: any;
    setModel: Dispatch<SetStateAction<any>>;
    visible?: boolean;
    setVisible?: Dispatch<SetStateAction<boolean>>;
    onClose?: () => void;
    count?: number;
}

export default function SurveyOtherPreview(props: SurveyOtherPreviewIPops) {

    const { visible, onClose, model, setModel, title } = props;
    const [translate] = useTranslation();
    const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(new AppUserFilter());
    const [fieldFilter, setFieldFilter] = React.useState<string>();
    const [
        ,
        ,
        dataSource,
        pagination,
        handleTableChange,
    ] = surveyPreiviewService.useAppUserList(
        model,
        setModel,
        nameof(model.otherResults),
        appUserFilter,
        setAppUserFilter,
        fieldFilter,
    );

    const handleValueFilter = React.useCallback(
        (field: string) => (ev: React.ChangeEvent<HTMLInputElement>) => {
            setFieldFilter(field);
            appUserFilter[field].contain = (ev.target.value).toLocaleLowerCase();
            appUserFilter.skip = 0;
            setAppUserFilter({
                ...appUserFilter,
            });
        },
        [appUserFilter],
    );

    const columns: ColumnProps<AppUser>[] = React.useMemo(() => {
        return [
            {
                key: generalLanguageKeys.columns.index,
                title: translate(generalLanguageKeys.columns.index),
                width: 60,
                render: renderMasterIndex<AppUser>(),
            },
            {
                key: nameof(dataSource[0].displayName),
                dataIndex: nameof(dataSource[0].displayName),
                title: translate('surveys.appUsers.displayName'),
            },
            {
                key: nameof(dataSource[0].phone),
                dataIndex: nameof(dataSource[0].phone),
                title: translate('surveys.appUsers.phone'),
                ellipsis: true,
            },
            {
                key: nameof(dataSource[0].email),
                dataIndex: nameof(dataSource[0].email),
                title: translate('surveys.appUsers.email'),
            },
            {
                key: nameof(dataSource[0].address),
                dataIndex: nameof(dataSource[0].address),
                title: translate('surveys.appUsers.address'),
            },
        ];
    }, [dataSource, translate]);

    const handleClose = React.useCallback(() => {
        onClose();
    }, [onClose]);

    return (
        <MasterPreview
            isOpen={visible}
            onClose={handleClose}
            size="xl"
            title={title}
            className="preview"
        >
            <Row className="row-preview">
                <Col className="pl-1" span={8}>
                    <FormItem
                        className="mb-0"
                        label={translate('surveys.appUsers.displayName')}
                        labelAlign="left"
                    >
                        <Input
                            type="text"
                            onChange={handleValueFilter(nameof(appUserFilter.displayName))}
                            className="form-control form-control-sm mb-2"
                            placeholder={translate('surveys.appUsers.placeholder.displayName')}
                        />
                    </FormItem>
                </Col>
                <Col className="pl-1" span={8}>
                    <FormItem
                        className="mb-0"
                        label={translate('surveys.appUsers.phone')}
                        labelAlign="left"
                    >
                        <Input
                            type="text"
                            onChange={handleValueFilter(nameof(appUserFilter.phone))}
                            className="form-control form-control-sm mb-2"
                            placeholder={translate('surveys.appUsers.placeholder.phone')}
                        />
                    </FormItem>
                </Col>
                <Col className="pl-1" span={8}>
                    <FormItem
                        className="mb-0"
                        label={translate('surveys.appUsers.email')}
                        labelAlign="left"
                    >
                        <Input
                            type="text"
                            onChange={handleValueFilter(nameof(appUserFilter.email))}
                            className="form-control form-control-sm mb-2"
                            placeholder={translate('surveys.appUsers.placeholder.email')}
                        />
                    </FormItem>
                </Col>
            </Row>
            <Table
                tableLayout="fixed"
                columns={columns}
                dataSource={dataSource}
                pagination={pagination}
                key={uuidv4()}
                onChange={handleTableChange}
                className="ml-3"
            />
        </MasterPreview>
    );
}
