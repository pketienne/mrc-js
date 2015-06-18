class Legend
  attr_accessor :translation
  
  def initialize(tsv)
    set_a = tsv.line_number_first_labels
    set_b = tsv.line_number_last_labels
    @translation = (set_a + set_b).uniq!.sort!
  end

end
