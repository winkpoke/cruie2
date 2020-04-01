/**
 * Created by miyaye on 2020/3/17.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class MyComponent extends Component {
    render() {
        return (
            <ul>
                <li>Row 行</li>
                <li>Input 输入框</li>
                <li>Select 下拉</li>
                <li>Radio 单选框</li>
                <li>CheckBox 复选框</li>
                <li>TextArea 多行文本</li>
            </ul>
        );
    }
}

MyComponent.propTypes = {};

export default MyComponent;
