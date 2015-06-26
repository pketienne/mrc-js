class TSV
  attr_accessor :uri, :column_labels, :records                

  def initialize(uri)
    @uri = uri
    @column_labels = []
    @records = []

    process_file
  end

  def process_file
    file_lines = IO.readlines(@uri)
    @column_labels = file_lines.shift.chomp.split("\t")
    adjust_line_number_column_labels
    file_lines.each do | record |
      @records.push(Record.new(record))
    end
  end

  def adjust_line_number_column_labels
    @column_labels[1] = "fabulae"
    @column_labels[3] = "line_number_first_ordinate"
    @column_labels[4] = "line_number_first_label"
    @column_labels.insert(5, "line_number_last_ordinate")
    @column_labels.insert(6, "line_number_last_label")
    @column_labels[9] = "genera"
    @column_labels[18] = "meter_type"
  end
    
  def line_number_first_labels
    @records.map { |r| r.line_number_first_label }
  end

  def line_number_last_labels
    @records.map { |r| r.line_number_last_label }
  end

  def populate_ordinates!(legend)
    @records.each do |r|
      r.line_number_first_ordinate = legend.translation.index(r.line_number_first_label)
      r.line_number_last_ordinate = legend.translation.index(r.line_number_last_label)
    end
  end
  
end
