import React from 'react';
import { Checkbox, Row, Col } from 'antd';
import $ from 'jquery';

const CheckboxGroup = Checkbox.Group;
const { Fragment } = React;
import { connect } from 'react-redux';

class Sku extends React.Component {
    constructor(props) {
        super(props);
        this.res = {};
        this.result = [];
        this.showTable = false;
        //this.selectedSkuRows = [];
    }
    state = {
        detail:  null,
        currentAttrs: this.props.currentAttrs,
        skuAttrs: [],
        selectedSkuRows: [],
    }
    componentDidMount() {
        console.log('sku')
        const { route } = this.props;
        //如果是编辑模式 初始化数据 主要是表格数据selectedSkuRows
        if (this.props.isEdit) {
            //处理sku 加上option的label
            var attrsWithValue = this.props.currentAttrs;
            //console.log(attrsWithValue);
            const { skus:selectedSkuRows } = this.props.detail;
            if (!!selectedSkuRows ) {
                selectedSkuRows.map(skuRow => {
                    skuRow.attrs.map(attr => {
                        const { attribute_id } = attr;
                        var options = _.filter(attrsWithValue, item => item.id == attribute_id)[0]['options'];
                        var optLabel = _.filter(options, opt => opt.id == attr['value'])[0];
                        attr['label'] = optLabel['label'];

                    });
                });
            }
            this.setState({selectedSkuRows})
            //this.selectedSkuRows = selectedSkuRows;
            //处理表头
            const { skuAttrs } = this.props;
            skuAttrs.forEach(item => this.labelChange(item, 1));
        }
    }
    onChange = (item, checkedList) => {
        console.log('on change')
        item['checkedList'] = checkedList;
        item['indeterminate'] = !!checkedList.length && checkedList.length < item.options.length;
        item['checkAll'] = checkedList.length === item.options.length;
        this.labelChange(item);

        //下面这行是为了重新render
        this.setState({ skuAttrs: this.props.skuAttrs });
    };

    onCheckAllChange = (item, index, e) => {
        item['checkedList'] = e.target.checked ? _.map(item.options, 'value') : [];
        item['checkAll'] = e.target.checked;
        item['indeterminate'] = !e.target.checked;
        this.labelChange(item);
        this.setState({ skuAttrs: this.props.skuAttrs });
    };

    doExchange = doubleArrays => {
        var len = doubleArrays.length;
        if (len >= 2) {
            var arr1 = doubleArrays[0];
            var arr2 = doubleArrays[1];
            var len1 = doubleArrays[0].length;
            var len2 = doubleArrays[1].length;
            var newlen = len1 * len2;
            var temp = new Array(newlen);
            var index = 0;

            for (var i = 0; i < len1; i++) {
                for (var j = 0; j < len2; j++) {
                    temp[index] = arr1[i] + ',' + arr2[j];
                    index++;
                }
            }
            var newArray = new Array(len - 1);
            newArray[0] = temp;

            if (len > 2) {
                var _count = 1;
                for (var i = 2; i < len; i++) {
                    newArray[_count] = doubleArrays[i];
                    _count++;
                }
            }
            return this.doExchange(newArray);
        } else {
            return doubleArrays[0];
        }
    };

    labelChange = (item, isMounted) => {
        //console.log('label change',item);
        var attr = item['name'];
        this.res[attr] = {
            label: item['title'],
            checkedList: item.checkedList,
        };

        //根据英文找出对应option中文
        var arr_title_zh = [];
        var k_v = [];
        _.filter(item.options, opt => {
            if (item.checkedList.indexOf(opt.value) != -1) {
                arr_title_zh.push(`${item.id}_${item.name}_${opt.value}_${opt.id}_${opt.label}`);
            }
        });
        this.res[attr]['checkedListTrans'] = arr_title_zh;
        this.res[attr]['k_v'] = k_v;

        if (item.checkedList.length == 0) {
            this.res = _.omit(this.res, attr);
        }
        this.showTable = _.values(this.res).length == this.props.skuAttrs.length;

        var arr2 = []; //最终用到的是arr2

        for (var attr in this.res) {
            if (this.res[attr]['checkedList'].length > 0) {
                //arr1.push(this.res[attr]['checkedList']);
                arr2.push(this.res[attr]['checkedListTrans']);
            }
        }

        this.resultZh = this.doExchange(arr2);
        console.log(this.resultZh)
        if (!isMounted) {
           var selectedSkuRows = [];
            this.resultZh.forEach((row, index) => {
                row = row.split(',');
                var tmpRow = [];
                row.forEach(column => {
                    var rowarr = column.split('_');
                    var tmpObj = {
                        name: rowarr[1],
                        attribute_id: rowarr[0],
                        value: rowarr[3],
                        label: rowarr.pop(),
                    };
                    tmpRow.push(tmpObj);
                });
                 selectedSkuRows.push({ attrs: tmpRow, stock: '', price: '' });
                 this.setState({selectedSkuRows})
            });
        }

        if (this.showTable) {
            var timer = setTimeout(()=>{
                this.createTable();
                for (var i = 0; i < arr2.length; i++) {
                    this.mergeCell($('table'), i);
                }
            },50)
        } else {
            $('#createTable').html('');
        }
    };

    createTable() {
        var _this = this;
        if ($('#createTable').children().length == 0) {
            $(
                '<table id="sku-table" className="margin-tb-12" border="1" cellpadding="1" cellspacing="0"><thead><tr style="background:#f9f8f7"></tr></thead><tbody></tbody></table>'
            ).appendTo($('#createTable'));
        }
        var str = '';
        for (var attr in this.res) {
            str += '<th>' + this.res[attr]['label'] + '</th>';
        }
        str += `<th>库存</th><th>价格</th>`;
        $('#createTable thead tr').html(str);
            var strBody = '';
            this.state.selectedSkuRows.forEach((row, index) => {
                var str2 = '';
                row.attrs.forEach((column, indexColumn) => {
                    str2 += `<td>${column.label}</td>`;
                });
                str2 += `<td><input name="stock" value="${row.stock}" column_number="${row.attrs.length}" row_number="${index}" placeholder="stock" type="number"/></td>
                   <td><input name="price"  value="${row.price}" column_number="${row.attrs.length + 1}" row_number="${index}" placeholder="price" type="number"/></td>`;
                strBody += `<tr data-index="${index}">${str2}</tr>`;
            });

            $('#createTable tbody').html(strBody);

            var timer = setTimeout(()=>{
                $('[name="stock"]').on('change',function () {
                    console.log('stock change 了')
                    var index = $(this).attr('row_number');
                    console.log(index,$(this).val(),_this.state.selectedSkuRows)
                    _this.state.selectedSkuRows[index]['stock'] = $(this).val();
                });

                $('[name="price"]').on('change',function () {
                    console.log('price change 了')
                    var index = $(this).attr('row_number');
                    console.log(index,$(this).val(),_this.state.selectedSkuRows)
                    _this.state.selectedSkuRows[index]['price'] = $(this).val();
                });

                _this.props.getSelectedRows(_this.state.selectedSkuRows)
            },1000);

    }

    mergeCell($table, colIndex) {
        $table.data('col-content', ''); // 存放单元格内容
        $table.data('col-rowspan', 1); // 存放计算的rowspan值 默认为1
        $table.data('col-td', $()); // 存放发现的第一个与前一行比较结果不同td(jQuery封装过的), 默认一个"空"的jquery对象

        $table.data('trNum', $('tbody tr', $table).length); // 要处理表格的总行数, 用于最后一行做特殊处理时进行判断之用
        // 我们对每一行数据进行"扫面"处理 关键是定位col-td, 和其对应的rowspan
        $('tbody tr', $table).each(function(index) {
            // td:eq中的colIndex即列索引
            var $td = $('td:eq(' + colIndex + ')', this);

            // 取出单元格的当前内容
            var currentContent = $td.html();

            // 第一次时走此分支
            if ($table.data('col-content') == '') {
                $table.data('col-content', currentContent);
                $table.data('col-td', $td);
            } else {
                // 上一行与当前行内容相同
                if ($table.data('col-content') == currentContent) {
                    // 上一行与当前行内容相同则col-rowspan累加, 保存新值
                    var rowspan = $table.data('col-rowspan') + 1;
                    $table.data('col-rowspan', rowspan);
                    // 值得注意的是 如果用了$td.remove()就会对其他列的处理造成影响
                    $td.hide();
                    // 最后一行的情况比较特殊一点
                    // 比如最后2行 td中的内容是一样的, 那么到最后一行就应该把此时的col-td里保存的td设置rowspan
                    if (++index == $table.data('trNum'))
                        $table.data('col-td').attr('rowspan', $table.data('col-rowspan'));
                } else {
                    // 上一行与当前行内容不同
                    // col-rowspan默认为1, 如果统计出的col-rowspan没有变化, 不处理
                    if ($table.data('col-rowspan') != 1) {
                        $table.data('col-td').attr('rowspan', $table.data('col-rowspan'));
                    }
                    // 保存第一次出现不同内容的td, 和其内容, 重置col-rowspan
                    $table.data('col-td', $td);
                    $table.data('col-content', $td.html());
                    $table.data('col-rowspan', 1);
                }
            }
        });
    }

    render() {
        const { skuAttrs } = this.props ;
        return (
            <div className="mar-b15">
                {  skuAttrs && skuAttrs.length > 0 && skuAttrs.map((row, index) => (
                    <Fragment key={index}>
                        <Row>
                            <Col span={20} offset={4}>
                                <div>
                                    <b>{row.title}</b>
                                </div>
                                <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                                    <Checkbox
                                        indeterminate={row['indeterminate']}
                                        onChange={this.onCheckAllChange.bind(this, row, index)}
                                        checked={row['checkAll']}
                                    >
                                        全选
                                    </Checkbox>
                                </div>

                                <Checkbox.Group
                                    options={row['options']}
                                    name={row.name}
                                    value={row.checkedList}
                                    defaultValue={row.checkedList}
                                    onChange={this.onChange.bind(this, row)}
                                />
                            </Col>
                        </Row>
                    </Fragment>
                ))}
                <Row>
                    <Col span={20} offset={4}>
                        <div id="createTable" />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Sku;
