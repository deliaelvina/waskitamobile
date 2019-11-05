  // $ht.=' <div id="paymentaptqty"></div>';
  // $ht.='<div id="legenddiv"></div>';

 $sql = "SELECT * from mgr.v_sales_by_payment where product_cd='APT' $param2 "; //APT payment qty
// $sql = "SELECT * from mgr.v_nup_amt_group_agent_type";
            $dt11 = $this->m_wsbangun->getData_by_query($cons,$sql);
            $jscript11 = '';
            if(!empty($dt11)) {

                $bgColor = '"#2fb4ed","#ba68c8","#33e0ff","#0fe07f","#ffb74d","#4caf50","#ff7043"';
                $jscript11.='var pieData={labels:[';
                $jlabel11 = '';

                $jdata11= '';
                $jcolor= '';
                $jjum11='';


                // $sold = ($row->sold_unit/$row->total_unit) * 100;
                foreach ($dt11 as $key => $row) {
                    $jlabel11.='"'.$row->payment_descs.'",';


                    $qty = ($row->sales_qty / $row->total_sales_qty) * 100;
                    $qty = number_format($qty, 2);
                    $qty_unit = $row->sales_qty;



                    $jdata11.=$qty.',';
                    $jjum11.=$qty_unit.',';
                }

                $jlabel11 = substr($jlabel11,0,-1);
                // var_dump($jdata6);
                $jcolor=substr($jcolor,0,-1);
                $jdata11=substr($jdata11,0,-1);
                $jjum11=substr($jjum11,0,-1);

                //$jpersen='var calcPrice=('.$jdata.' * '.$jjum.' / 100 );';
                $jscript11.=$jlabel11.'],datasets:[{label: ['.$jjum11.'] ,data:['.$jdata11.'],backgroundColor:['.$bgColor.']}]};';
                    //var_dump($jpersen);
                // $jscript4.='var precentage = Math.floor((('.$jdata.' / '.$jjum.') * 100)+0.5);';
                // $jscript4.='return precentage + "%";';

                $jscript11.='var pieOption={  legend:{onClick: null}, responsive: true, maintainAspectRatio: false, label: true, tooltips: {callbacks: {
                                label: function(tooltipItem, data) {
                                    var dataset = data.datasets[tooltipItem.datasetIndex];
                                    var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {return previousValue + currentValue;});
                                    var currentValue = dataset.data[tooltipItem.index];
                                    var amt = dataset.label[tooltipItem.index];
                                    // amt = amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    var precentage = Math.floor(((currentValue/total) * 100)+0.5);
                                    return "Qty :" + amt;
                                }
                    }}, showPercentage: true, scales: {label: [{display: true}]}};';

                $jscript11.='var ctx=document.getElementById("paymentaptqty").getContext("2d");';
                // $jscript1.='ctx.fillStyle="Black";';
                // $jscript1.='var textSize=document.getElementById("amtchart").width/15;';
                $jscript11.='new Chart(ctx, {type: "pie", data: pieData, options:pieOption});';
                // $jscript11.='document.getElementById("js-legend").innerHTML = paymentaptqty.generateLegend();';

            }

            $jscript11.='var chart = AmCharts.makeChart( "paymentaptqty", {';
            $jlabel11 = '';

            $jdata11= '';
            $jjum11='';

            foreach ($dt11 as $key => $row) {
                $jlabel11.='"'.$row->payment_descs.'",';


                $qty = ($row->sales_qty / $row->total_sales_qty) * 100;
                $qty = number_format($qty, 2);
                $qty_unit = $row->sales_qty;



                $jdata11.=$qty.',';
                $jjum11.=$qty_unit.'';
            }

            $jlabel11 = substr($jlabel11,0,-1);
            $jdata11=substr($jdata11,0,-1);
            $jjum11=substr($jjum11,0,-1);

            $jscript11.='type: "pie",';
            $jscript11.='theme: "light",';
            $jscript11.=' labelsEnabled: "false",';
            $jscript11.=' pullOutRadius: "0",';
            $jscript11.='legend: {markerType: "circle",divId: "legenddiv"},';
            $jscript11.='dataProvider: [{"name": '.$jlabel11.',"data": '.$jdata11.'}],';
            $jscript11.='valueField: "data",';
            $jscript11.='titleField: "name"});';


            var pieData = {
                labels: ["KPA", "Kas Keras", "DP 20% 1x, Installment 15x", "Cash", "Installment 12 X",
                "Installment 24 X", "Installment 36 X", "Installment 36 X dan DP 6x", "Cash Keras", "Kpa", "KPA ",
                "Cash Keras (Di Angsur 15 x)", "Kas Keras (Di Angsur 12 x)", "Cash Keras (6x)",
                "Cash Keras (Angsur 8x)", "Cash (DP 20% 1x, Angsuran 5x)", "Cash (DP 20% 1x, Angsuran 5x)",
                "Kas Keras (Di Angsur 4 x)", "(DP 20%  3 x, Angsuran 12x)", "(DP 20%  3 x, Angsuran 24 + 9 x )",
                "(DP 20%  3 x, Angsuran 36 + 9 x )", "(DP 20%  3 x, Angsuran 48 + 9 x )", "(DP 20%  3 x, Angsuran 48)",
                "(DP 20% 1x, Angsuran 45x )", "(DP 20%  3 x, Angsuran 24 + 6 x )", ],
                datasets: [{
                    label: [5, 12, 2, 2, 3, 8, 15, 7, 1, 39, 4, 2, 23, 4, 1, 3, 3, 1, 7, 3, 6, 4, 1, 3, 28, 2, 1,],
                    data: [1.70, 4.08, 0.68, 0.68, 1.02, 2.72, 5.10, 2.38, 0.34, 13.27, 1.36, 0.68, 7.82, 1.36, 0.34],
                    backgroundColor: ["#2fb4ed", "#ba68c8", "#33e0ff", "#0fe07f", "#ffb74d", "#4caf50", "#ff7043"]
                }]
            };
            var pieOption = {
                    legend: {
                        onClick: null
                    },
                    responsive: true,
                    label: true,
                    animateScale: true,
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                var dataset = data.datasets[tooltipItem.datasetIndex];
                                var total = dataset.data.reduce(function(previousValue,
                                currentValue, currentIndex, array) {
                                    return previousValue + currentValue;
                                });
                                var currentValue = dataset.data[tooltipItem.index];
                                var amt = dataset.label[tooltipItem.index];
                                amt = amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                var precentage = Math.floor(((currentValue / total) * 100) + 0.5);
                                return "Amount :" + amt;
                            }
                        }

                        // INI JANGAN DI APA APAIN

                        $sql = "SELECT * from mgr.v_sales_by_payment where product_cd='APT' $param2 "; //APT payment qty
            $dt11 = $this->m_wsbangun->getData_by_query($cons,$sql);
            $jscript11 = '';

            if(!empty($dt11)) {
                $bgColor = '"#2fb4ed","#ba68c8","#33e0ff","#0fe07f","#ffb74d","#4caf50","#ff7043"';
                $jscript11.='var pieData={labels:[';
                $jlabel11 = '';

                $jdata11= '';
                $jcolor= '';
                $jjum11='';


                // $sold = ($row->sold_unit/$row->total_unit) * 100;
                foreach ($dt11 as $key => $row) {
                    $jlabel11.='"'.$row->payment_descs.'",';


                    $qty = ($row->sales_qty / $row->total_sales_qty) * 100;
                    $qty = number_format($qty, 2);
                    $qty_unit = $row->sales_qty;



                    $jdata11.=$qty.',';
                    $jjum11.=$qty_unit.',';
                }

                $jlabel11 = substr($jlabel11,0,-1);
                // var_dump($jdata6);
                $jcolor=substr($jcolor,0,-1);
                $jdata11=substr($jdata11,0,-1);
                $jjum11=substr($jjum11,0,-1);

                //$jpersen='var calcPrice=('.$jdata.' * '.$jjum.' / 100 );';
                $jscript11.=$jlabel11.'],datasets:[{label: ['.$jjum11.'] ,data:['.$jdata11.'],backgroundColor:['.$bgColor.']}]};';
                    //var_dump($jpersen);
                // $jscript4.='var precentage = Math.floor((('.$jdata.' / '.$jjum.') * 100)+0.5);';
                // $jscript4.='return precentage + "%";';

                $jscript11.='var pieOption={ legend:{onClick: null}, responsive: false, label: true, tooltips: {callbacks: {
                    label: function(tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {return previousValue + currentValue;});
                        var currentValue = dataset.data[tooltipItem.index];
                        var amt = dataset.label[tooltipItem.index];
                        amt = amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        var precentage = Math.floor(((currentValue/total) * 100)+0.5);
                        return "Amount :" + amt;
                    }
                }}, showPercentage: true, scales: {label: [{display: true}]}};';

                $jscript11.='var ctx=document.getElementById("paymentaptqty").getContext("2d");';
                // $jscript1.='var textSize=document.getElementById("amtchart").width/15;';
                $jscript11.='new Chart(ctx, {type: "pie", data: pieData, options:pieOption});';
                // $jscript11.='document.getElementById("js-legend").innerHTML = paymentaptqty.generateLegend();';
            }



            //

            $param = " where project_no='".$project."' AND entity_cd='".$entity."'";
            $sql = "SELECT * from mgr.v_sales_summary_group_by_product_list  $param  ORDER BY product_cd";
            $dt1 = $this->m_wsbangun->getData_by_query($cons,$sql);
            // var_dump($cons);
            $bb = 'APT';
            $apt = array_filter($dt1,function($a) use($bb) {

                            return $a->product_cd === $bb;

                        });

            $jdata1= '';
            $jdata3='';
            $jcolor= '';
            $jjum1= '';
    // var_dump($apt);exit();
            foreach ($apt as $key => $row) {
                $p1 = '["'.$row->status_descs.'",'.$row->amount.']';
                $P2 = '["'.$row->status_descs.'",'.$row->unit.']';
                //set colour
                $cl='';
                if($row->STATUS=='A'){
                    $cl ='"#80d82d"';
                }else if($row->STATUS=='B'){
                    $cl ='"#e82020"';
                }else if($row->STATUS=='H'){
                    $cl ='"#2fb4ed"';
                }else if($row->STATUS=='R'){
                    $cl ='"#ff6b0f"';
                }
                else {
                    $cl ='"#ff6b0f"';
                }
                $c1 = $row->status_descs.' : '.$cl;
                $jdata1.= $p1.',';
                $jcolor.= $c1.',';
                $jdata3.= $P2.',';
            }
            // var_dump($jdata1);exit();
            $jdata1=substr($jdata1,0,-1);
            $jcolor=substr($jcolor,0,-1);
            $jdata3=substr($jdata3,0,-1);

             $pie1 = '';
            $pie1.='var chart1 = c3.generate({bindto: "#aptamtchart",padding: {bottom: 20,top:10}, data: {';
            $pie1.='         columns: [ '.$jdata1.'], ';
            $pie1.='         type : "pie",        ';
            $pie1.='         colors :{'.$jcolor.'}         ';
            $pie1.='     }, ';
            $pie1.='     tooltip: { ';
            $pie1.='         format: { ';
            // $pie1.='             // title: function (d) { return 'Data ' + d; }, ';
            $pie1.='             value: function (value, ratio, id) { ';
            $pie1.='                 return formatNumber(value); ';
            $pie1.='             } ';
            $pie1.='         } ';
            $pie1.='     } ';
            $pie1.=' });';


            $pie3 = '';
            $pie3.='var chart1 = c3.generate({bindto: "#aptunitchart",data: {';
            $pie3.='         columns: [ '.$jdata3.'], ';
            $pie3.='         type : "pie",        ';
            $pie3.='         colors :{'.$jcolor.'}         ';
            $pie3.='     }, ';
            $pie3.='     tooltip: { ';
            $pie3.='         format: { ';
            // $pie1.='             // title: function (d) { return 'Data ' + d; }, ';
            $pie3.='             value: function (value, ratio, id) { ';
            $pie3.='                 return value; ';
            $pie3.='             } ';
            $pie3.='         } ';
            $pie3.='     } ';
            $pie3.=' });';

                        // $sql = "SELECT * from mgr.v_sales_by_payment where product_cd='APT' $param2 "; //APT payment amt
            // // $sql = "SELECT * from mgr.v_nup_amt_group_agent_type";
            // $dt12 = $this->m_wsbangun->getData_by_query($cons,$sql);
            // $jscript12 = '';
            // if(!empty($dt12)) {

            //     $bgColor = '"#2fb4ed","#ba68c8","#33e0ff","#0fe07f","#ffb74d","#4caf50","#ff7043"';
            //     $jscript12.='var pieData={labels:[';
            //     $jlabel12 = '';

            //     $jdata12= '';
            //     $jcolor= '';
            //     $jjum12='';


            //     // $sold = ($row->sold_unit/$row->total_unit) * 100;
            //     foreach ($dt12 as $key => $row) {
            //         $jlabel12.='"'.$row->payment_descs.'",';


            //         $qty = ($row->sales_amt / $row->total_sales_amt) * 100;
            //         $qty = number_format($qty, 2);
            //         $qtyAmt = $row->sales_amt;


            //         $jdata12.=$qty.',';
            //         $jjum12.=$qtyAmt.',';
            //     }

            //     $jlabel12 = substr($jlabel12,0,-1);
            //     // var_dump($jdata6);
            //     $jcolor=substr($jcolor,0,-1);
            //     $jdata12=substr($jdata12,0,-1);
            //     $jjum12=substr($jjum12,0,-1);

            //     //$jpersen='var calcPrice=('.$jdata.' * '.$jjum.' / 100 );';
            //     $jscript12.=$jlabel12.'],datasets:[{label: ['.$jjum12.'],data:['.$jdata12.'],backgroundColor:['.$bgColor.']}]};';
            //         //var_dump($jpersen);
            //     // $jscript4.='var precentage = Math.floor((('.$jdata.' / '.$jjum.') * 100)+0.5);';
            //     // $jscript4.='return precentage + "%";';

            //     $jscript12.='var pieOption={ legend:{onClick: null}, responsive: true, label: true, tooltips: {callbacks: {
            //                     label: function(tooltipItem, data) {
            //                         var dataset = data.datasets[tooltipItem.datasetIndex];
            //                         var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {return previousValue + currentValue;});
            //                         var currentValue = dataset.data[tooltipItem.index];
            //                         var amt = dataset.label[tooltipItem.index];
            //                         amt = amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            //                         var precentage = Math.floor(((currentValue/total) * 100)+0.5);
            //                         return "Amount :" + amt;
            //                     }
            //                 }}, showPercentage: true, scales: {label: [{display: true}]}};';

            //     $jscript12.='var ctx=document.getElementById("paymentaptamt").getContext("2d");';
            //     // $jscript1.='ctx.fillStyle="Black";';
            //     // $jscript1.='var textSize=document.getElementById("amtchart").width/15;';
            //     $jscript12.='new Chart(ctx, {type: "pie", data: pieData, options:pieOption});';

            // }
