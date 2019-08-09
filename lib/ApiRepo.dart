import 'package:api_demo/ApiEndpoint.dart';
import 'package:api_demo/ApiHitter.dart';
import 'package:api_demo/model_entity.dart';
class ApiRepo
{
  final apiHitter = ApiHitter();
  final dio = ApiHitter.getDio();

  Future<ModelEntity> getRequests() async {
    ApiResponse apiResponse = await apiHitter
        .getApiResponse(ApiEndpoint.PEOPLE_ONE);
    if (apiResponse.status) {
      return ModelEntity.fromJson(apiResponse.response.data)..status=true;
    } else {
      return ModelEntity(message: apiResponse.msg);
    }
  }

}