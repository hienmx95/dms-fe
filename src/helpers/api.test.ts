import { transformAPIContent } from 'core/helpers/data';
import { transformAPIRequestValue, transformAPIResponseValue } from 'helpers/api';
import 'config/http';

describe('test api', () => {
  it('work', () => {
    const input = [
      {
        'errors': null,
        'id': 97,
        'code': 'FPLED0001',
        'supplierCode': null,
        'name': 'Đèn LED âm trần Downlight D AT16L 110/7W.DA',
        'description': null,
        'scanCode': null,
        'productTypeId': 20,
        'supplierId': 2,
        'brandId': 20,
        'unitOfMeasureId': 44,
        'unitOfMeasureGroupingId': 20,
        'salePrice': null,
        'retailPrice': null,
        'taxTypeId': null,
        'statusId': 1,
        'otherName': null,
        'technicalName': null,
        'note': null,
        'productType': {
          'errors': null,
          'id': 20,
          'code': 'T00098                                                                                              ',
          'name': 'Thành phẩm',
          'description': 'Thành phẩm sau khi sản xuất',
          'statusId': 1,
          'updatedTime': '0001-01-01T00:00:00'
        },
        'supplier': {
          'errors': null,
          'id': 2,
          'code': 'SPL004',
          'name': 'Rạng Đông',
          'taxCode': '3400181691',
          'statusId': 1
        },
        'brand': {
          'errors': null,
          'id': 20,
          'code': 'RD',
          'name': 'Rạng Đông',
          'statusId': 1
        },
        'unitOfMeasure': {
          'errors': null,
          'id': 44,
          'code': 'C1',
          'name': 'Cái',
          'description': null,
          'statusId': 1
        },
        'unitOfMeasureGrouping': {
          'errors': null,
          'id': 20,
          'name': 'Nhóm đơn vị tính cho Đèn LED',
          'unitOfMeasureId': 44,
          'statusId': 1
        },
        'taxType': null,
        'status': {
          'errors': null,
          'id': 1,
          'code': 'ACTIVE',
          'name': 'Hoạt động'
        }
      },
      {
        'errors': null,
        'id': 98,
        'code': 'FPLED0002',
        'supplierCode': null,
        'name': 'Đèn LED Downlight đổi màu AT16 90/7W.DA SS',
        'description': null,
        'scanCode': null,
        'productTypeId': 20,
        'supplierId': 2,
        'brandId': 20,
        'unitOfMeasureId': 44,
        'unitOfMeasureGroupingId': 20,
        'salePrice': null,
        'retailPrice': null,
        'taxTypeId': null,
        'statusId': 1,
        'otherName': null,
        'technicalName': null,
        'note': null,
        'productType': {
          'errors': null,
          'id': 20,
          'code': 'T00098                                                                                              ',
          'name': 'Thành phẩm',
          'description': 'Thành phẩm sau khi sản xuất',
          'statusId': 1,
          'updatedTime': '0001-01-01T00:00:00'
        },
        'supplier': {
          'errors': null,
          'id': 2,
          'code': 'SPL004',
          'name': 'Rạng Đông',
          'taxCode': '3400181691',
          'statusId': 1
        },
        'brand': {
          'errors': null,
          'id': 20,
          'code': 'RD',
          'name': 'Rạng Đông',
          'statusId': 1
        },
        'unitOfMeasure': {
          'errors': null,
          'id': 44,
          'code': 'C1',
          'name': 'Cái',
          'description': null,
          'statusId': 1
        },
        'unitOfMeasureGrouping': {
          'errors': null,
          'id': 20,
          'name': 'Nhóm đơn vị tính cho Đèn LED',
          'unitOfMeasureId': 44,
          'statusId': 1
        },
        'taxType': null,
        'status': {
          'errors': null,
          'id': 1,
          'code': 'ACTIVE',
          'name': 'Hoạt động'
        }
      },
      {
        'errors': null,
        'id': 99,
        'code': 'FPLED0003',
        'supplierCode': null,
        'name': 'Đèn LED âm trần Downlight D AT16L 90/7W.DA',
        'description': null,
        'scanCode': null,
        'productTypeId': 20,
        'supplierId': 2,
        'brandId': 20,
        'unitOfMeasureId': 44,
        'unitOfMeasureGroupingId': 20,
        'salePrice': null,
        'retailPrice': null,
        'taxTypeId': null,
        'statusId': 1,
        'otherName': null,
        'technicalName': null,
        'note': null,
        'productType': {
          'errors': null,
          'id': 20,
          'code': 'T00098                                                                                              ',
          'name': 'Thành phẩm',
          'description': 'Thành phẩm sau khi sản xuất',
          'statusId': 1,
          'updatedTime': '0001-01-01T00:00:00'
        },
        'supplier': {
          'errors': null,
          'id': 2,
          'code': 'SPL004',
          'name': 'Rạng Đông',
          'taxCode': '3400181691',
          'statusId': 1
        },
        'brand': {
          'errors': null,
          'id': 20,
          'code': 'RD',
          'name': 'Rạng Đông',
          'statusId': 1
        },
        'unitOfMeasure': {
          'errors': null,
          'id': 44,
          'code': 'C1',
          'name': 'Cái',
          'description': null,
          'statusId': 1
        },
        'unitOfMeasureGrouping': {
          'errors': null,
          'id': 20,
          'name': 'Nhóm đơn vị tính cho Đèn LED',
          'unitOfMeasureId': 44,
          'statusId': 1
        },
        'taxType': null,
        'status': {
          'errors': null,
          'id': 1,
          'code': 'ACTIVE',
          'name': 'Hoạt động'
        }
      },
      {
        'errors': null,
        'id': 100,
        'code': 'FPLED0004',
        'supplierCode': null,
        'name': 'Đèn LED nuôi tảo (T25W 120/BR)',
        'description': null,
        'scanCode': null,
        'productTypeId': 20,
        'supplierId': 2,
        'brandId': 20,
        'unitOfMeasureId': 44,
        'unitOfMeasureGroupingId': 20,
        'salePrice': null,
        'retailPrice': null,
        'taxTypeId': null,
        'statusId': 1,
        'otherName': null,
        'technicalName': null,
        'note': null,
        'productType': {
          'errors': null,
          'id': 20,
          'code': 'T00098                                                                                              ',
          'name': 'Thành phẩm',
          'description': 'Thành phẩm sau khi sản xuất',
          'statusId': 1,
          'updatedTime': '0001-01-01T00:00:00'
        },
        'supplier': {
          'errors': null,
          'id': 2,
          'code': 'SPL004',
          'name': 'Rạng Đông',
          'taxCode': '3400181691',
          'statusId': 1
        },
        'brand': {
          'errors': null,
          'id': 20,
          'code': 'RD',
          'name': 'Rạng Đông',
          'statusId': 1
        },
        'unitOfMeasure': {
          'errors': null,
          'id': 44,
          'code': 'C1',
          'name': 'Cái',
          'description': null,
          'statusId': 1
        },
        'unitOfMeasureGrouping': {
          'errors': null,
          'id': 20,
          'name': 'Nhóm đơn vị tính cho Đèn LED',
          'unitOfMeasureId': 44,
          'statusId': 1
        },
        'taxType': null,
        'status': {
          'errors': null,
          'id': 1,
          'code': 'ACTIVE',
          'name': 'Hoạt động'
        }
      },
      {
        'errors': null,
        'id': 101,
        'code': 'FPLED0005',
        'supplierCode': null,
        'name': 'Đèn LED Downlight đổi màu AT16 110/9W.DA SS',
        'description': null,
        'scanCode': null,
        'productTypeId': 20,
        'supplierId': 2,
        'brandId': 20,
        'unitOfMeasureId': 44,
        'unitOfMeasureGroupingId': 20,
        'salePrice': null,
        'retailPrice': null,
        'taxTypeId': null,
        'statusId': 1,
        'otherName': null,
        'technicalName': null,
        'note': null,
        'productType': {
          'errors': null,
          'id': 20,
          'code': 'T00098                                                                                              ',
          'name': 'Thành phẩm',
          'description': 'Thành phẩm sau khi sản xuất',
          'statusId': 1,
          'updatedTime': '0001-01-01T00:00:00'
        },
        'supplier': {
          'errors': null,
          'id': 2,
          'code': 'SPL004',
          'name': 'Rạng Đông',
          'taxCode': '3400181691',
          'statusId': 1
        },
        'brand': {
          'errors': null,
          'id': 20,
          'code': 'RD',
          'name': 'Rạng Đông',
          'statusId': 1
        },
        'unitOfMeasure': {
          'errors': null,
          'id': 44,
          'code': 'C1',
          'name': 'Cái',
          'description': null,
          'statusId': 1
        },
        'unitOfMeasureGrouping': {
          'errors': null,
          'id': 20,
          'name': 'Nhóm đơn vị tính cho Đèn LED',
          'unitOfMeasureId': 44,
          'statusId': 1
        },
        'taxType': null,
        'status': {
          'errors': null,
          'id': 1,
          'code': 'ACTIVE',
          'name': 'Hoạt động'
        }
      },
      {
        'errors': null,
        'id': 102,
        'code': 'FPLED0006',
        'supplierCode': null,
        'name': 'Đèn LED âm trần Downlight D AT16L 90/9W.DA',
        'description': null,
        'scanCode': null,
        'productTypeId': 20,
        'supplierId': 2,
        'brandId': 20,
        'unitOfMeasureId': 44,
        'unitOfMeasureGroupingId': 20,
        'salePrice': null,
        'retailPrice': null,
        'taxTypeId': null,
        'statusId': 1,
        'otherName': null,
        'technicalName': null,
        'note': null,
        'productType': {
          'errors': null,
          'id': 20,
          'code': 'T00098                                                                                              ',
          'name': 'Thành phẩm',
          'description': 'Thành phẩm sau khi sản xuất',
          'statusId': 1,
          'updatedTime': '0001-01-01T00:00:00'
        },
        'supplier': {
          'errors': null,
          'id': 2,
          'code': 'SPL004',
          'name': 'Rạng Đông',
          'taxCode': '3400181691',
          'statusId': 1
        },
        'brand': {
          'errors': null,
          'id': 20,
          'code': 'RD',
          'name': 'Rạng Đông',
          'statusId': 1
        },
        'unitOfMeasure': {
          'errors': null,
          'id': 44,
          'code': 'C1',
          'name': 'Cái',
          'description': null,
          'statusId': 1
        },
        'unitOfMeasureGrouping': {
          'errors': null,
          'id': 20,
          'name': 'Nhóm đơn vị tính cho Đèn LED',
          'unitOfMeasureId': 44,
          'statusId': 1
        },
        'taxType': null,
        'status': {
          'errors': null,
          'id': 1,
          'code': 'ACTIVE',
          'name': 'Hoạt động'
        }
      },
      {
        'errors': null,
        'id': 103,
        'code': 'FPLED0009',
        'supplierCode': null,
        'name': 'Đèn LED âm trần Downlight D AT16L 110/9W.DA',
        'description': null,
        'scanCode': null,
        'productTypeId': 20,
        'supplierId': 2,
        'brandId': 20,
        'unitOfMeasureId': 44,
        'unitOfMeasureGroupingId': 20,
        'salePrice': null,
        'retailPrice': null,
        'taxTypeId': null,
        'statusId': 1,
        'otherName': null,
        'technicalName': null,
        'note': null,
        'productType': {
          'errors': null,
          'id': 20,
          'code': 'T00098                                                                                              ',
          'name': 'Thành phẩm',
          'description': 'Thành phẩm sau khi sản xuất',
          'statusId': 1,
          'updatedTime': '0001-01-01T00:00:00'
        },
        'supplier': {
          'errors': null,
          'id': 2,
          'code': 'SPL004',
          'name': 'Rạng Đông',
          'taxCode': '3400181691',
          'statusId': 1
        },
        'brand': {
          'errors': null,
          'id': 20,
          'code': 'RD',
          'name': 'Rạng Đông',
          'statusId': 1
        },
        'unitOfMeasure': {
          'errors': null,
          'id': 44,
          'code': 'C1',
          'name': 'Cái',
          'description': null,
          'statusId': 1
        },
        'unitOfMeasureGrouping': {
          'errors': null,
          'id': 20,
          'name': 'Nhóm đơn vị tính cho Đèn LED',
          'unitOfMeasureId': 44,
          'statusId': 1
        },
        'taxType': null,
        'status': {
          'errors': null,
          'id': 1,
          'code': 'ACTIVE',
          'name': 'Hoạt động'
        }
      },
      {
        'errors': null,
        'id': 104,
        'code': 'FPLED0007',
        'supplierCode': null,
        'name': 'Đèn LED Downlight điều khiển bằng Remote D AT16L 110/ 9W.RF',
        'description': null,
        'scanCode': null,
        'productTypeId': 20,
        'supplierId': 2,
        'brandId': 20,
        'unitOfMeasureId': 44,
        'unitOfMeasureGroupingId': 20,
        'salePrice': null,
        'retailPrice': null,
        'taxTypeId': null,
        'statusId': 1,
        'otherName': null,
        'technicalName': null,
        'note': null,
        'productType': {
          'errors': null,
          'id': 20,
          'code': 'T00098                                                                                              ',
          'name': 'Thành phẩm',
          'description': 'Thành phẩm sau khi sản xuất',
          'statusId': 1,
          'updatedTime': '0001-01-01T00:00:00'
        },
        'supplier': {
          'errors': null,
          'id': 2,
          'code': 'SPL004',
          'name': 'Rạng Đông',
          'taxCode': '3400181691',
          'statusId': 1
        },
        'brand': {
          'errors': null,
          'id': 20,
          'code': 'RD',
          'name': 'Rạng Đông',
          'statusId': 1
        },
        'unitOfMeasure': {
          'errors': null,
          'id': 44,
          'code': 'C1',
          'name': 'Cái',
          'description': null,
          'statusId': 1
        },
        'unitOfMeasureGrouping': {
          'errors': null,
          'id': 20,
          'name': 'Nhóm đơn vị tính cho Đèn LED',
          'unitOfMeasureId': 44,
          'statusId': 1
        },
        'taxType': null,
        'status': {
          'errors': null,
          'id': 1,
          'code': 'ACTIVE',
          'name': 'Hoạt động'
        }
      }
    ];
    const transformedResponseData = transformAPIContent(input, undefined, transformAPIResponseValue);
    const output = transformAPIContent(transformedResponseData, undefined, transformAPIRequestValue);
    expect(output[0].productType.updatedTime).toEqual(input[0].productType.updatedTime.replace('T', ' '));
    // tslint:disable-next-line: no-console
    console.log(output[0].productType.updatedTime);
  });
});
