import React from "react";
import {View, Navigator} from "react-native";

let BaseConfig = Navigator.SceneConfigs.FloatFromRight;
let BottomConfig = Navigator.SceneConfigs.FloatFromBottom;
let ReverseConfig = Navigator.SceneConfigs.FloatFromLeft;

let defaultSceneConfig = Object.assign({}, BaseConfig, {
	gestures: false
});

let reverseSceneConfig = Object.assign({}, ReverseConfig, {
	gestures: false
});

let bottomSceneConfig = Object.assign({}, BottomConfig, {
	gestures: false,
});

//this is ghetto, but we are only gonna have 2 transitions, up/down left/right
let sceneTransitions = {
	default : defaultSceneConfig,
	reverse : reverseSceneConfig,
	bottom  : bottomSceneConfig
}

export default class Router {

	constructor(routes,initialRoute, callback){
		this.nav = (
			<Navigator
				initialRoute={initialRoute}
				renderScene={this.renderScene.bind(this)}
				onDidFocus={callback}
				configureScene={this.configureScene.bind(this)}/>
		);

		this.routes = routes;
		this.navigator = null;
		this.next = null;

		this.push = this.push.bind(this);
		this.pop = this.pop.bind(this);
		this.resetTo = this.resetTo.bind(this);
	}

	renderScene(route,nav)
	{
		if(this.navigator === null)
		{
			this.navigator = nav;
		}
		let navBar = route.navigationBar;
		
		this.next = this.routes[route.id];

		if(navBar)
		{
			this.next = <View style={{flex:1}}>
							{navBar}
							{next}
						</View>
		}

		if( route.data ) route.data.router = this; else route.data = { router : this };

		this.next = React.cloneElement(this.next, route.data);

		return this.next;
	}

	configureScene(route){
		if(typeof route !== 'undefined')
		{
			return sceneTransitions[route.transition];
		} else {
			return sceneTransitions.default;
		}
	}

	push(route){
		if(typeof route !== 'undefined')
		{
			if(this.navigator){
				this.navigator.push(route);
			}
		}
	}

	popN(steps){
		if(this.navigator)
		{
			this.navigator.popN(steps);
		}
	}

	resetTo(route){
		if(typeof route !== 'undefined')
		{
			if(this.navigator){
				this.navigator.resetTo(route);
			}
		}
	}
	immediatelyResetRouteStack(stack){
		if(this.navigator){
			this.navigator.immediatelyResetRouteStack(stack);
		}
	}

	pop(){
		this.navigator.pop();
	}
}