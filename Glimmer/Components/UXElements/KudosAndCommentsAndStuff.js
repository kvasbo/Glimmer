import React from "react";
import {View} from "react-native";
import {Badge} from "react-native-elements";
import GiKudos from "./GiKudos";
import VisKudos from "./VisKudos";

export default class KudosAndCommentsAndStuff extends React.Component {

    constructor(props) {
        super(props);
    }

    //Switch kudos section based on who created the post
    getKudosSection() {
        if (this.props.byMe) {
            var kudos = [];

            if(typeof this.props.post.kudos.from !== "undefined")
            {
                kudos = this.props.post.kudos.from;
            }

            return (<VisKudos kudos={kudos}/>)

        }
        else {
            var given = false;
            if (typeof(this.props.post.kudos.given) !== "undefined" && this.props.post.kudos.given) {
                given = true;
            }
            return (<GiKudos id={this.props.post.id} type="post" given={given}/>)
        }
    }

    render() {

        var comText = "kommentar";

        if (this.props.post.comment_count !== 1) {
            comText = "kommentarer";
        }

        return (

            <View style={{flexDirection: "row"}}>

                {this.getKudosSection()}

                <Badge
                    value={this.props.post.comment_count + " " + comText}
                    textStyle={{color: 'white'}}
                    containerStyle={{backgroundColor: 'orange'}}
                    onPress={() => this.props.navigator.push({
                        screen: 'glimmer.PageThread',
                        title: this.props.post.title,
                        passProps: {post: this.props.post}
                    })}
                />

            </View>
        )
    }
}