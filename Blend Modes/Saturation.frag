/*
 *  Saturation.frag
 *  Hexels 2
 *
 *  Copyright 2017 Imre Somogyi
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

#define BLEND_SHADER

void main()
{
	vec4 baseLayer = texture2D(_LowerLayer, gl_TexCoord[0].xy);
	vec4 blendLayer = texture2D(_UpperLayer, gl_TexCoord[0].xy);
	
   vec3 baseHSV = rgb2hsv( baseLayer.rgb );
	//saturation
	vec3 saturation = hsv2rgb( vec3(baseHSV.r, rgb2hsv( blendLayer.rgb ).g, baseHSV.b ));

	blendLayer.a *= _LayerOpacity;
	gl_FragColor.rgb = mix(baseLayer.rgb, saturation, blendLayer.a);

	gl_FragColor.a = baseLayer.a + (1.0-baseLayer.a) * blendLayer.a;
	
	//if we're on transparent background, instead of multiplying, we just normal-blend
	gl_FragColor = mix(blendLayer * vec4(blendLayer.aaa, 1.0), gl_FragColor, baseLayer.a);

}