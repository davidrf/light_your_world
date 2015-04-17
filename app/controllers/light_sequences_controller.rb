class LightSequencesController < ApplicationController
  def index
    light_show = LightShow.find(params[:light_show_id])
    @light_sequences = light_show.light_sequences.order(:scheduled_time)
    respond_to do |format|
      format.json { render json: @light_sequences }
    end
  end

  def create
    @light_sequence = LightSequence.new(light_sequence_params)
    @light_sequence.light_show = LightShow.find(params[:light_show_id])
    if @light_sequence.save
      flash[:notice] = 'Light Sequence Added!'
    else
      flash[:alert] = 'Light Sequence Was Not Saved.'
    end

    redirect_to new_light_show_url
  end

  def destroy
    @light_sequence = LightSequence.find(params[:id])
    @light_sequence.destroy
    respond_to do |format|
      format.json { render json: @light_sequence }
    end
  end

  private

  def light_sequence_params
    params.require(:light_sequence).permit(:scheduled_time, :light_effect_id, :light_id, :transition_time, :on)
  end
end
