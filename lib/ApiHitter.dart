import 'package:api_demo/ApiEndpoint.dart';
import 'package:dio/dio.dart';

class ApiHitter {
  static Dio _dio;

  static Dio getDio() {
    if (_dio == null) {
      BaseOptions options = new BaseOptions(
          baseUrl: ApiEndpoint.BaseUrl,
          connectTimeout: 30000,
          receiveTimeout: 30000);
      return new Dio(options)
        ..interceptors
            .add(InterceptorsWrapper(onRequest: (RequestOptions options) {
        }, onResponse: (Response response) {
          //   print(response.data.toString());
          //print(response);
          return response; // continue
        }, onError: (DioError e) {
          return e;
        }));
    } else {
      return _dio;
    }
  }

  Future<ApiResponse> getApiResponse(String endPoint,
      {Map<String, dynamic> headers,
      Map<String, dynamic> queryParameters}) async {
    try {
      Response response = await getDio().get(endPoint,
          options: Options(headers: headers), queryParameters: queryParameters);
      return ApiResponse(true, response: response);
    } catch (error, stacktrace) {
      print("Exception occured: $error stackTrace: $stacktrace");
      return ApiResponse(false, msg: "$error");
    }
  }

  Future<ApiResponse> getPostApiResponse(String endPoint,
      {Map<String, dynamic> headers, Map<String, dynamic> data}) async {
    try {
      var response = await getDio()
          .post(endPoint, options: Options(headers: headers), data: data);
      return ApiResponse(true,
          response: response, msg: response.data["message"]);
    } catch (error, stacktrace) {
      try {
        return ApiResponse(false,
            msg: "${error?.response?.data ?? "Sorry Something went wrong."}");
      } catch (e) {
        return ApiResponse(false, msg: "Sorry Something went wrong.");
      }
    }
  }
}

class ApiResponse {
  final bool status;
  final String msg;
  final Response response;

  ApiResponse(this.status, {this.msg = "Success", this.response});
}
