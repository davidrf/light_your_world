class LightEffectsController < ApplicationController
  def index
    @light_effects = LightEffect.all
    respond_to do |format|
      format.json { render json: @light_effects }
    end
  end

  def show
    @light_effect = LightEffect.find(params[:id])
    respond_to do |format|
      format.json { render json: @light_effect }
    end
  end

  def new
    @light_effect = LightEffect.new
    if LightEffect.exists?
      @light_effect_dropdown = LightEffect.order(:name).map { |le| [le.name, le.id] }
    end
  end

  def create
    @light_effect = LightEffect.new(light_effect_params)
    @light_effect.user = current_user
    if LightEffect.exists?
      @light_effect_dropdown = LightEffect.order(:name).map do |le|
        [le.name, le.id]
      end
    end

    if @light_effect.save
      flash[:notice] = 'Light Effect Added!'
      redirect_to new_light_effect_url
    else
      flash[:alert] = 'Light Effect Was Not Saved.'
      render :new
    end
  end

  def update
    @light_effect = LightEffect.find(params[:id])
    if @light_effect.update(light_effect_params)
      flash[:notice] = 'Light Effect Updated!'
      respond_to do |format|
        format.json { render json: @light_effect }
      end
    else
      flash[:alert] = 'Light Effect Was Not Updated.'
    end
  end

  def destroy
    @light_effect = LightEffect.find(params[:id])
    @light_effect.destroy
    respond_to do |format|
      format.json { render json: @light_effect }
    end
  end

  private

  def light_effect_params
    params.require(:light_effect).permit(:name, :hue, :brightness, :saturation, :transition_time, :on)
  end
end
