import 'package:api_demo/model_entity.dart';

class EntityFactory {
  static T generateOBJ<T>(json) {
    if (1 == 0) {
      return null;
    } else if (T.toString() == "ModelEntity") {
      return ModelEntity.fromJson(json) as T;
    } else {
      return null;
    }
  }
}