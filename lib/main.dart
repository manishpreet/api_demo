import 'package:api_demo/ApiRepo.dart';
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(

        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);



  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  String message='click below button to hit Api';


  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
    child: Column(
    children: <Widget>[

      Text(message),
      MaterialButton(
        onPressed: (){
          hitApi();
        },
        child: Container(
          padding: EdgeInsets.all(16.0),
          color: Colors.blue,
          margin: EdgeInsets.only(top: 25.0),
            child: Text('Hit Api')),
      )
    ],
    ),
    ));
  }

  Future hitApi() async {
    setState(() {
      message='wait for a sec....';
    });
    var repo=ApiRepo();
    await repo.getRequests().then((data){


      setState(() {
        if(data.status)
        message='name ${data.name} gender ${data.gender}';
        else
          message='someting went wrong';
      });
    });
  }
}
