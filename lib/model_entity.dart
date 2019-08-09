class ModelEntity {
	List<String> films;
	String homeworld;
	String gender;
	String skinColor;
	String edited;
	String created;
	String mass;
	List<String> vehicles;
	String url;
	String hairColor;
	String birthYear;
	String eyeColor;
	List<String> species;
	List<String> starships;
	String name;
	String height;
	bool status=false;
	String message;

	ModelEntity({this.films,this.message, this.homeworld, this.gender, this.skinColor, this.edited, this.created, this.mass, this.vehicles, this.url, this.hairColor, this.birthYear, this.eyeColor, this.species, this.starships, this.name, this.height});

	ModelEntity.fromJson(Map<String, dynamic> json) {
		films = json['films']?.cast<String>();
		homeworld = json['homeworld'];
		gender = json['gender'];
		skinColor = json['skin_color'];
		edited = json['edited'];
		created = json['created'];
		mass = json['mass'];
		vehicles = json['vehicles']?.cast<String>();
		url = json['url'];
		hairColor = json['hair_color'];
		birthYear = json['birth_year'];
		eyeColor = json['eye_color'];
		species = json['species']?.cast<String>();
		starships = json['starships']?.cast<String>();
		name = json['name'];
		height = json['height'];
	}

	Map<String, dynamic> toJson() {
		final Map<String, dynamic> data = new Map<String, dynamic>();
		data['films'] = this.films;
		data['homeworld'] = this.homeworld;
		data['gender'] = this.gender;
		data['skin_color'] = this.skinColor;
		data['edited'] = this.edited;
		data['created'] = this.created;
		data['mass'] = this.mass;
		data['vehicles'] = this.vehicles;
		data['url'] = this.url;
		data['hair_color'] = this.hairColor;
		data['birth_year'] = this.birthYear;
		data['eye_color'] = this.eyeColor;
		data['species'] = this.species;
		data['starships'] = this.starships;
		data['name'] = this.name;
		data['height'] = this.height;
		return data;
	}
}
