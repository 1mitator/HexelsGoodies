/*
 *  HardMix.frag
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

float colorDodgeBlendFunction(float blendLayerComponent, float baseLayerComponent)
{
   if ( blendLayerComponent == 1.0 )
   {
      return blendLayerComponent;
   }
   return min(baseLayerComponent / (1.0 - blendLayerComponent), 1.0);
}

float colorBurnBlendFunction(float blendLayerComponent, float baseLayerComponent)
{
   if ( blendLayerComponent == 0.0 )
   {
      return blendLayerComponent;
   }
   return max( 1.0 - ( 1.0 - baseLayerComponent) / blendLayerComponent, 0.0 );
}

float vividLightBlendFunction(float blendLayerComponent, float baseLayerComponent)
{
   if ( baseLayerComponent < 0.5 )
   {
      return colorBurnBlendFunction( 2.0 * blendLayerComponent, baseLayerComponent );
   }
   return colorDodgeBlendFunction( 2.0 * ( blendLayerComponent - 0.5 ), baseLayerComponent);
}

float hardMixBlendFunction(float blendLayerComponent, float baseLayerComponent)
{
   if ( vividLightBlendFunction(blendLayerComponent,baseLayerComponent) < 0.5 )
   {
      return 0.0;
   }
   return 1.0;
}

void main()
{
	vec4 baseLayer = texture2D(_LowerLayer, gl_TexCoord[0].xy);
	vec4 blendLayer = texture2D(_UpperLayer, gl_TexCoord[0].xy);
		
   vec3 hardMix = vec3(hardMixBlendFunction(blendLayer.r,baseLayer.r), hardMixBlendFunction(blendLayer.g,baseLayer.g), hardMixBlendFunction(blendLayer.b,baseLayer.b));

	blendLayer.a *= _LayerOpacity;

	gl_FragColor.rgb = mix(baseLayer.rgb, hardMix, blendLayer.a);

	gl_FragColor.a = baseLayer.a + (1.0-baseLayer.a) * blendLayer.a;
	
	//if we're on transparent background, instead of multiplying, we just normal-blend
	gl_FragColor = mix(blendLayer * vec4(blendLayer.aaa, 1.0), gl_FragColor, baseLayer.a);

}