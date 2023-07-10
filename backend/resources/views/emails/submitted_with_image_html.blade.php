<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Carson's Circle of Lights Coloring Contest</title>
    </head>
    
    <body>
    <table>
        <tr>
            <td>
                <table style="border-collapse:collapse; background-color:#FFFFFF; border:1px solid #CCCCCC; width:600px; font-family:Arial; font-size:12px;">
                    <!-- header -->
                    <tr>
                        <td style="text-align:center;">
                            <img src="http://circleoflightscontest.indystardev.com/common/img/DigitalColoringContestHeader-eblast.jpg" style="width:600px" alt="Carson's Circle of Lights Coloring Contest" />
                        </td>
                    </tr><!-- end header -->
                    
                    <!-- main -->
                    <tr>
                        <td style="text-align:center; vertical-align:top; font-size:20px; font-weight:bold;">
                            <span>Contest Entry</span>
                        </td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table>
                                <tr>
                                    <!-- colored image -->
                                    <td style="vertical-align:top; padding:10px; text-align:center;">
                                        <a href="{{$imageUrl}}" target="_blank"><img src="{{$thumbnailUrl}}" style="width:200px; border:2px solid #666666" alt="Image preview" /></a>
                                    </td>
                                    <!-- participant info -->
                                    <td style="vertical-align:top; padding:10px; font-size:16px;">
                                        <span><b>Child's Name:</b> {{$name}}</span><br />
                                        <span><b>Age:</b> {{$age}}</span><br />
                                        <span><b> Phone:</b> {{$phone}}</span><br />
                                        <span><b>Parent's Name:</b> {{$parentName}}</span><br />
                                        <span><b>Parent's Email:</b> {{$email}}</span><br />
                                        <span><b>Zip code:</b> {{$zipCode}}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- end main -->
                    
                    <!-- footer -->
                    <tr>
                    	<td style="padding:10px; text-align:center;">
                  			<a href="http://www.indystar.com" target="_blank"><img src="http://circleoflightscontest.indystardev.com/common/img/indystar-logo.jpg" style="width:175px;" alt="www.indystar.com"></a>
                        </td>
                    </tr><!-- end footer -->
                </table>
            </td>
        </tr>
    </table>
    </body>
</html>
